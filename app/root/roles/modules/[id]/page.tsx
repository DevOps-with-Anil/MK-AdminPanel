'use client';

import { useParams } from 'next/navigation';
import { AdminProvider } from '@/contexts/AdminContext';
import { useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search, Layers, AlertCircle, CheckCircle2
} from 'lucide-react';

import {
  getModulePackages,
  getRoleById,
  updateRoleModules
} from '@/services/auth.service';

/* ================= TYPES ================= */

type ModuleStatus = 'active' | 'inactive';

interface Action {
  _id: string;
  key: string;
  actionName: string;
  status: boolean;
}

interface Module {
  id: string;
  name: string;
  key: string;
  actions: Action[];
  status: ModuleStatus;
}

/* ================= COMPONENT ================= */

function PlanPermissionsContent({ roleId }: { roleId: string }) {


  const params = useParams();
  roleId = params?.id as string;

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
   const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [modRes, roleRes] = await Promise.all([
        getModulePackages('systemmodule', {}),
        getRoleById(roleId)
      ]);

      const systemModules = modRes.data;
      const RoleModules = roleRes.data.permissions || [];
      /* ✅ PLAN MAP (FIXED) */
      const RoleMap: Record<string, any> = {};

      RoleModules.forEach((pm: any) => {
        RoleMap[pm.moduleKey] = pm;
      });

      /* ✅ MERGE (FIXED CORE LOGIC) */
      const mergedModules: Module[] = systemModules.map((m: any) => {

        const systemModule = RoleMap[m.key];

        const actions = (m.actions || []).map((a: any) => {

          const roleAction = systemModule?.actions?.find(
            (pa: any) => pa.actionKey === a.key
          );

          return {
            _id: a._id,
            key: a.key,
            actionName: a.actionName,
            status: roleAction?.allowed ?? false
          };
        });

        return {
          id: m._id,
          key: m.key,
          name: m.moduleName,
          actions,
          status: actions.some((a: Action) => a.status)
            ? 'active'
            : 'inactive'
        };
      });

      setModules(mergedModules);
      setSelectedModule(mergedModules[0]?.id);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOGGLES ================= */

  const toggleModule = (moduleId: string) => {
    setModules(prev =>
      prev.map(mod => {
        if (mod.id !== moduleId) return mod;

        const newStatus = mod.status === 'active' ? 'inactive' : 'active';

        return {
          ...mod,
          status: newStatus,
          actions: mod.actions.map(a => ({
            ...a,
            status: newStatus === 'active' ? a.status : false
          }))
        };
      })
    );
  };

  const toggleAction = (moduleId: string, actionId: string) => {
    setModules(prev =>
      prev.map(mod => {
        if (mod.id !== moduleId) return mod;
        if (mod.status === 'inactive') return mod;

        const updatedActions = mod.actions.map(a =>
          a._id === actionId
            ? { ...a, status: !a.status }
            : a
        );

        return {
          ...mod,
          actions: updatedActions,
          status: updatedActions.some(a => a.status)
            ? 'active'
            : 'inactive'
        };
      })
    );
  };

  /* ================= SAVE ================= */

  // const handleSave = async () => {
  //   try {
  //     const modulesPayload = modules.map(mod => ({
  //       moduleKey: mod.key,
  //       status: mod.status === 'active' ? 'ACTIVE' : 'INACTIVE',

  //       actions: mod.actions.map(a => ({
  //         actionKey: a.key,
  //         allowed: a.status
  //       }))
  //     }));

  //           console.log("Set Merge Module : " + JSON.stringify(modulesPayload))

  //     await updateRoleModules(roleId, { modules: modulesPayload });

  //     alert('Role permissions updated');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const handleSave = async () => {
    setError('');
    setSuccess(false);
    try {
      const modulesPayload = modules
        // ✅ only active modules
        .filter(mod => mod.status === 'active')

        .map(mod => ({
          moduleKey: mod.key,

          // ✅ only allowed actions
          actions: mod.actions
            .filter(a => a.status === true)
            .map(a => ({
              actionKey: a.key,
              allowed: true
            }))
        }))
        // ✅ remove modules with no actions (optional but recommended)
        .filter(mod => mod.actions.length > 0);

      await updateRoleModules(roleId, { modules: modulesPayload });

      // Success
      setSuccess(true);
      setTimeout(() => {
      setSuccess(false);  
      }, 2000);

    } catch (err: any) {
      setError(err?.message);
      setTimeout(() => {
      setError("");  
      }, 2000);
      
    } finally {
      setIsLoading(false);
    }
  };


  /* ================= FILTER ================= */

  const filteredModules = modules.filter(
    (mod) =>
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================= UI ================= */

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <Layers className="text-primary w-7 h-7 mt-1" />
          <div>
            <h1 className="text-xl font-medium">Plan Permissions</h1>
            <p className="text-muted-foreground">
              Assign modules & actions to this role
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <Input
              placeholder="Search Modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={handleSave}>
            Update Permissions
          </Button>
        </div>
      </div>
      {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Permissions updated successfully!</p>
              </div>
            )}

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Modules</CardTitle>
              <CardDescription>Select modules for this Role</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {filteredModules.map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModule(mod.id)}
                  className={`p-4 border rounded-lg cursor-pointer ${selectedModule === mod.id
                    ? 'border-primary bg-primary/5'
                    : ''
                    }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{mod.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {mod.key}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between mt-3">
                    <Badge variant="secondary">
                      {mod.actions.length} permissions
                    </Badge>

                    <Badge
                      onClick={(e) => {
                        // e.stopPropagation();
                        toggleModule(mod.id);
                      }}
                      className={`cursor-pointer ${mod.status === 'active'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-400 text-white'
                        }`}
                    >
                      {mod.status.toUpperCase()}
                    </Badge>

                    {/* {selectedModule === mod.id && <CheckCircle />} */}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div>
          <Card className="sticky top-0">
            <CardHeader>
              <CardTitle>Module Actions</CardTitle>
              <p className="text-sm font-regular text-muted-foreground">
                Select atleast one action to enable this module
              </p>
            </CardHeader>

            <CardContent>
              {selectedModule ? (
                modules
                  .filter((m) => m.id === selectedModule)
                  .map((mod) => (
                    <div key={mod.id} className="space-y-2">
                      {mod.actions.map((action) => (
                        <div
                          key={action._id}
                          className={`flex justify-between p-3 border rounded ${mod.status === 'inactive'
                            ? 'opacity-50 pointer-events-none'
                            : ''
                            }`
                          }
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {action.actionName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {action.key}
                            </p>
                          </div>

                          <Badge
                            onClick={() =>
                              toggleAction(mod.id, action._id)
                            }
                            className={`cursor-pointer ${action.status
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-400 text-white'
                              }`}
                          >
                            {action.status ? 'ACTIVE' : 'INACTIVE'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ))
              ) : (
                <p className="text-center text-muted-foreground">
                  Select module to view actions
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ================= EXPORT ================= */

export default function PlanPermissionsPage({ roleId }: { roleId: string }) {
  return (
    <AdminProvider>
      <PlanPermissionsContent roleId={roleId} />
    </AdminProvider>
  );
}
