'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  Layers,
  CheckCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getModulePackages, updateStatus, deleteEntity } from '@/services/auth.service';


/* ================= TYPES ================= */

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
  actionsCount: number;
  status: 'active' | 'inactive';
}

/* ================= COMPONENT ================= */

function ModulesPageContent() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number | 'All'>(10);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'];


  /* ================= SEARCH ================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchRootModule();
  }, [page, limit, debouncedSearch]);

  const fetchRootModule = async () => {
    try {
      setLoading(true);

      const fetchLimit = limit === 'All' ? 0 : limit;

      const res = await getModulePackages('tenantmodule', {
        page,
        limit: fetchLimit,
        search: debouncedSearch,
      });

      const formatted: Module[] = res.data.map((m: any) => ({
        id: m._id,
        key: m.key,
        name: m.moduleName,
        actions: m.actions || [],
        actionsCount: m.actions?.length || 0,
        status: m.status === 'ACTIVE' ? 'active' : 'inactive',
      }));

      setModules(formatted);

      console.log("Total pages : " + JSON.stringify(res));

      setTotalPages(res.meta?.totalPages || 2);
    } catch (err) {
      console.error('Fetch modules error', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE MODULE STATUS ================= */

  const handleToggleStatus = async (
    moduleId: string,
    currentStatus: 'active' | 'inactive'
  ) => {
    const newStatus =
      currentStatus === 'active' ? 'inactive' : 'active';

    // optimistic UI
    setModules(prev =>
      prev.map(r =>
        r.id === moduleId
          ? { ...r, status: newStatus, updating: true }
          : r
      )
    );

    try {
      await updateStatus('tenantmodule', moduleId, {
        status:
          newStatus === 'active' ? 'ACTIVE' : 'INACTIVE',
      });

      setModules(prev =>
        prev.map(r =>
          r.id === moduleId
            ? { ...r, updating: false }
            : r
        )
      );
    } catch (err) {
      console.error(err);

      // rollback
      setModules(prev =>
        prev.map(r =>
          r.id === moduleId
            ? { ...r, status: currentStatus, updating: false }
            : r
        )
      );
    }
  };


  /* ================= TOGGLE ACTION ================= */

  const handleToggleActionStatus = (
    moduleId: string,
    actionId: string
  ) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;

        if (mod.status === 'inactive') return mod;

        return {
          ...mod,
          actions: mod.actions.map((a) =>
            a._id === actionId
              ? { ...a, status: !a.status }
              : a
          ),
        };
      })
    );
  };


  /* ================= DELETE ROLE ================= */

  const handleDelete = async (
    moduleId: string,
    moduleName: string
  ) => {
    if (!confirm(`Delete "${moduleName}" Module?`)) return;

    try {
      await deleteEntity('tenantmodule', moduleId);

      // ✅ instant UI update
      setModules(prev => prev.filter(r => r.id !== moduleId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete module');
    }
  };
  /* ================= FILTER ================= */

  const filteredModules = modules.filter(
    (mod) =>
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <Layers className="text-primary w-7 h-7 mt-1" />
          <div>
            <h1 className="text-xl font-medium">Modules & Features</h1>
            <p className="text-muted-foreground">
              Manage platform modules and permissions
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

          <Link href="/admin/modules/affiliate-modules/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Module
            </Button>
          </Link>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <Card>
            {/* ✅ UPDATED HEADER WITH THEME SELECT */}
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Available Modules</CardTitle>
                <CardDescription>
                  Page {page} of {totalPages}
                </CardDescription>
              </div>
              {/* Page Row Limit */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Show: {limit}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {PAGE_LIMIT_OPTIONS.map(option => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => {
                        const newLimit: number | 'All' = option === 'All' ? 'All' : Number(option);
                        setLimit(newLimit);
                        setPage(1);
                      }}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

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

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        {/* ✅ EDIT */}
                        <DropdownMenuItem
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   handleEdit(mod.id);
                        // }}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>

                        {/* ✅ DELETE */}
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(mod.id, mod.name);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex justify-between mt-3">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{mod.actionsCount} permissions</Badge>

                      <Badge
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(mod.id,
                            mod.status);
                        }}
                        className="cursor-pointer"
                      >
                        {mod.status}
                      </Badge>

                    </div>

                    {selectedModule === mod.id && <CheckCircle />}
                  </div>
                </div>
              ))}
            </CardContent>
            {/* PAGINATION */}
            <div className="flex justify-end gap-2 p-4">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={page === i + 1 ? 'default' : 'outline'}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div>
          <Card className="sticky top-0">
            <CardHeader>
              <CardTitle>Module Actions</CardTitle>
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
                            }`}
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
                              handleToggleActionStatus(mod.id, action._id)
                            }
                            className={`cursor-pointer ${mod.status === 'inactive'
                              ? 'bg-red-600 text-white cursor-not-allowed'
                              : action.status
                                ? 'bg-green-600 text-white'
                                : 'bg-red-600 text-white'
                              }`}
                          >
                            {mod.status === 'inactive'
                              ? 'Disabled'
                              : action.status
                                ? 'Active'
                                : 'Inactive'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ))
              ) : (
                <p className="text-center text-muted-foreground">
                  Please select a module to view its actions
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="text-center pt-6">
            <p className="text-2xl font-bold">{modules.length}</p>
            <p>Total Modules</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center pt-6">
            <p className="text-2xl font-bold">
              {modules.reduce((s, m) => s + m.actionsCount, 0)}
            </p>
            <p>Total Permissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center pt-6">
            <p className="text-2xl font-bold">
              {modules.filter((m) => m.status === 'active').length}
            </p>
            <p>Active Modules</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ================= EXPORT ================= */

export default function ModulesPage() {
  return (
    <AdminProvider>
      <ModulesPageContent />
    </AdminProvider>
  );
}