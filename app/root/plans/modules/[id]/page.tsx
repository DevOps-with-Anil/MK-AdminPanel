'use client';

import { useParams } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { useState, useEffect, useCallback } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search, Layers, CheckCircle
} from 'lucide-react';

import {
  getModulePackages,
  getPlantoEdit,
  updatePlanModules
} from '@/services/auth.service';

import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';

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

export default function PlanPermissionsContent() {

  // alert(planId)
  const { t } = useAdmin();

  const params = useParams();

  const planId =
    params?.id as string;

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const { message, type, visible, showMessage, clearMessage } = useAppMessage();


  /* ================= FETCH ================= */

  // useEffect(() => {
  //   fetchData();
  // }, []);



  // const fetchData = async () => {
  //   try {
  //     setLoading(true);

  //     const [modRes, planRes] = await Promise.all([
  //       getModulePackages('tenantmodule', {}),
  //       getPlantoEdit(planId)
  //     ]);

  //     const tenantModules = modRes.data;
  //     const planModules = planRes.data.modules || [];

  //     /* ✅ PLAN MAP (FIXED) */
  //     const planMap: Record<string, any> = {};

  //     planModules.forEach((pm: any) => {
  //       planMap[pm.moduleKey] = pm;
  //     });

  //     /* ✅ MERGE (FIXED CORE LOGIC) */
  //     const mergedModules: Module[] = tenantModules.map((m: any) => {

  //       const planModule = planMap[m.key];

  //       const actions = (m.actions || []).map((a: any) => {

  //         const planAction = planModule?.actions?.find(
  //           (pa: any) => pa.actionKey === a.key
  //         );

  //         return {
  //           _id: a._id,
  //           key: a.key,
  //           actionName: a.actionName,
  //           status: planAction?.allowed ?? false
  //         };
  //       });

  //       return {
  //         id: m._id,
  //         key: m.key,
  //         name: m.moduleName,
  //         actions,
  //         status: actions.some((a: Action) => a.status)
  //           ? 'active'
  //           : 'inactive'
  //       };
  //     });

  //     setModules(mergedModules);
  //     setSelectedModule(mergedModules[0]?.id);

  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [modRes, planRes] = await Promise.all([
        getModulePackages(
          'tenantmodule',
          {}
        ),

        getPlantoEdit(planId)
      ]);

      const tenantModules =
        modRes.data;

      const planModules =
        planRes.data.modules || [];

      /* =========================================
         PLAN MODULE MAP
      ========================================== */

      const planMap: Record<
        string,
        any
      > = {};

      planModules.forEach(
        (pm: any) => {
          planMap[pm.moduleKey] =
            pm;
        }
      );

      /* =========================================
         MERGE MODULES + ACTIONS
      ========================================== */

      const mergedModules: Module[] =
        tenantModules.map(
          (m: any) => {

            const planModule =
              planMap[m.key];

            const actions =
              (m.actions || []).map(
                (a: any) => {

                  const planAction =
                    planModule?.actions?.find(
                      (pa: any) =>
                        pa.actionKey ===
                        a.key
                    );

                  return {
                    _id: a._id,

                    key: a.key,

                    actionName:
                      a.actionName,

                    status:
                      planAction?.allowed ??
                      false
                  };
                }
              );

            return {
              id: m._id,

              key: m.key,

              name: m.moduleName,

              actions,

              status:
                actions.some(
                  (a: Action) =>
                    a.status
                )
                  ? 'active'
                  : 'inactive'
            };
          }
        );

      setModules(mergedModules);

      setSelectedModule(
        mergedModules[0]?.id
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  }, [planId, t]);

  /* =========================================
     FETCH ON LOAD
  ========================================== */

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  //  const handleSave = async () => {
  //   try {
  //     // ✅ Filter only active modules
  //     const modulesPayload = modules
  //       .filter(mod => mod.status === 'active') // only active modules
  //       .map(mod => ({
  //         moduleKey: mod.key,
  //         status: 'ACTIVE', // all modules sent are active

  //         // ✅ Only actions with allowed = true
  //         actions: mod.actions
  //           .filter(a => a.status === true) // only allowed actions
  //           .map(a => ({
  //             actionKey: a.key,
  //             allowed: true
  //           }))
  //       }))
  //       // ✅ Remove modules that end up with no actions
  //       .filter(mod => mod.actions.length > 0);

  //     await updatePlanModules(planId, { modules: modulesPayload });

  //     // // console.log("Filtered Modules Payload:", JSON.stringify(modulesPayload, null, 2));

  //     // alert('Plan permissions updated');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };


  const handleSave = async () => {
    try {

      /* =================================================
         FILTER ACTIVE MODULES & ACTIONS
      ================================================== */

      const modulesPayload = modules

        /**
         * Keep only active modules
         */
        .filter(
          (mod) => mod.status === 'active'
        )

        /**
         * Transform module payload
         */
        .map((mod) => ({

          /**
           * Module identifier
           */
          moduleKey: mod.key,

          /**
           * All selected modules are active
           */
          status: 'ACTIVE',

          /**
           * Keep only allowed actions
           */
          actions: mod.actions

            .filter(
              (action) =>
                action.status === true
            )

            .map((action) => ({
              actionKey: action.key,
              allowed: true
            }))
        }))

        /**
         * Remove empty modules
         */
        .filter(
          (mod) => mod.actions.length > 0
        );

      /* =================================================
         UPDATE PLAN MODULE PERMISSIONS
      ================================================== */

      const res = await updatePlanModules(
        planId,
        {
          modules: modulesPayload
        }
      );

      const isSuccess =
        res?.status === 200;

      /* =================================================
         SUCCESS
      ================================================== */

      if (isSuccess) {

        showMessage(
          res?.message ||
          'Plan permissions updated successfully',
          'success'
        );

        return;
      }

      /* =================================================
         FAILURE
      ================================================== */

      showMessage(
        res?.message ||
        'Failed to update plan permissions',
        'danger'
      );

    } catch (err) {

      console.error(
        'Update plan modules error:',
        err
      );

      showMessage(
        'Something went wrong while updating permissions',
        'danger'
      );

    } finally {
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

            <h1 className="text-xl font-medium">
              {t(
                'translate.plan_permissions_title'
              )}
            </h1>

            <p className="text-muted-foreground">
              {t(
                'translate.plan_permissions_subtitle'
              )}
            </p>

          </div>
        </div>

        <div className="flex gap-2">

          <div className="relative w-64">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />

            <Input
              placeholder={t(
                'translate.search_modules'
              )}
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="pl-10"
            />

          </div>

          <Button onClick={handleSave}>
            {t(
              'translate.update_permissions'
            )}
          </Button>

        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2">

          <Card>

            <CardHeader>

              <CardTitle>
                {t(
                  'translate.available_modules'
                )}
              </CardTitle>

              <CardDescription>
                {t(
                  'translate.available_modules_description'
                )}
              </CardDescription>

            </CardHeader>

            <CardContent className="space-y-4">

              {filteredModules.map(
                (mod) => (
                  <div
                    key={mod.id}
                    onClick={() =>
                      setSelectedModule(
                        mod.id
                      )
                    }
                    className={`p-4 border rounded-lg cursor-pointer ${selectedModule ===
                        mod.id
                        ? 'border-primary bg-primary/5'
                        : ''
                      }`}
                  >

                    <div className="flex justify-between">

                      <div>

                        <h3 className="font-semibold">
                          {mod.name}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {mod.key}
                        </p>

                      </div>
                    </div>

                    <div className="flex justify-between mt-3">

                      <Badge variant="secondary">
                        {mod.actions.length}{' '}
                        {t(
                          'translate.permissions'
                        )}
                      </Badge>

                      <Badge
                        onClick={() => {
                          toggleModule(
                            mod.id
                          );
                        }}
                        className={`cursor-pointer ${mod.status ===
                            'active'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-400 text-white'
                          }`}
                      >
                        {t(
                          `translate.plans_${mod.status}`
                        )}
                      </Badge>

                    </div>
                  </div>
                )
              )}

            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div>

          <Card className="sticky top-0">

            <CardHeader>

              <CardTitle>
                {t(
                  'translate.module_actions'
                )}
              </CardTitle>

              <p className="text-sm font-regular text-muted-foreground">
                {t(
                  'translate.module_actions_description'
                )}
              </p>

            </CardHeader>

            <CardContent>

              {selectedModule ? (
                modules
                  .filter(
                    (m) =>
                      m.id ===
                      selectedModule
                  )
                  .map((mod) => (
                    <div
                      key={mod.id}
                      className="space-y-2"
                    >

                      {mod.actions.map(
                        (action) => (
                          <div
                            key={action._id}
                            className={`flex justify-between p-3 border rounded ${mod.status ===
                                'inactive'
                                ? 'opacity-50 pointer-events-none'
                                : ''
                              }`}
                          >

                            <div>

                              <p className="text-sm font-medium">
                                {
                                  action.actionName
                                }
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {action.key}
                              </p>

                            </div>

                            <Badge
                              onClick={() =>
                                toggleAction(
                                  mod.id,
                                  action._id
                                )
                              }
                              className={`cursor-pointer ${action.status
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-400 text-white'
                                }`}
                            >
                              {action.status
                                ? t(
                                  'translate.plans_active'
                                )
                                : t(
                                  'translate.plans_inactive'
                                )}
                            </Badge>

                          </div>
                        )
                      )}

                    </div>
                  ))
              ) : (
                <p className="text-center text-muted-foreground">
                  {t(
                    'translate.select_module_message'
                  )}
                </p>
              )}

            </CardContent>
          </Card>
        </div>
      </div>

      {/* =================================================
          GLOBAL MESSAGE
      ================================================== */}

      <AppMessage
        visible={visible}
        message={message}
        type={type}
        onClose={clearMessage}
      />
    </div>
  );
}

