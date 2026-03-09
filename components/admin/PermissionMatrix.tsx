'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Module, Action, Role } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLocalizedText } from '@/i18n/langHelper';
import { Copy, Check } from 'lucide-react';

interface PermissionMatrixProps {
  modules: Module[];
  roles: Role[];
  selectedRole?: Role;
  onPermissionChange?: (roleId: string, permissionKey: string, checked: boolean) => void;
  readOnly?: boolean;
}

/**
 * Permission Matrix Component
 * Displays modules + actions in a matrix format with ability to assign/revoke permissions
 * Supports multi-language display of module and action names
 */
export function PermissionMatrix({
  modules,
  roles,
  selectedRole,
  onPermissionChange,
  readOnly = false,
}: PermissionMatrixProps) {
  const { t, currentLanguage } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('matrix');
  const [copiedRoleId, setCopiedRoleId] = useState<string | null>(null);

  // Get all unique actions across all modules
  const allActions = useMemo(() => {
    const actionsMap = new Map<string, Action>();
    modules.forEach(module => {
      (module.actions || []).forEach(action => {
        actionsMap.set(action.id, action);
      });
    });
    return Array.from(actionsMap.values());
  }, [modules]);

  // Build permission matrix
  const permissionMatrix = useMemo(() => {
    if (!selectedRole) return [];

    const selectedPermissions = new Set(
      selectedRole.permissions?.map(p => `${p.moduleId}:${p.actionId}`) || []
    );

    return modules.map(module => ({
      module,
      permissions: (module.actions || []).map(action => ({
        action,
        hasPermission: selectedPermissions.has(`${module.id}:${action.id}`),
      })),
    }));
  }, [modules, selectedRole]);

  const handlePermissionToggle = (moduleId: string, actionId: string, checked: boolean) => {
    if (!selectedRole || readOnly) return;
    onPermissionChange?.(selectedRole.id, `${moduleId}:${actionId}`, checked);
  };

  const handleClonePermissions = (fromRoleId: string, toRoleId: string) => {
    const fromRole = roles.find(r => r.id === fromRoleId);
    if (!fromRole) return;

    // Copy permissions from source role to target role
    fromRole.permissions?.forEach(perm => {
      onPermissionChange?.(toRoleId, `${perm.moduleId}:${perm.actionId}`, true);
    });

    setCopiedRoleId(fromRoleId);
    setTimeout(() => setCopiedRoleId(null), 2000);
  };

  const getModuleAccessCount = (moduleId: string): { granted: number; total: number } => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return { granted: 0, total: 0 };

    const actions = module.actions || [];
    const granted = permissionMatrix
      .find(m => m.module.id === moduleId)
      ?.permissions.filter(p => p.hasPermission).length || 0;

    return { granted, total: actions.length };
  };

  if (!selectedRole) {
    return (
      <Card className="p-8">
        <p className="text-center text-muted-foreground">{t('ui.loading')} Select a role to view and manage permissions</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{getLocalizedText(selectedRole.name, currentLanguage)}</h2>
          {selectedRole.description && (
            <p className="text-muted-foreground">
              {getLocalizedText(selectedRole.description, currentLanguage)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {permissionMatrix.reduce((sum, m) => sum + m.permissions.filter(p => p.hasPermission).length, 0)} / {allActions.length} permissions
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          {roles.length > 1 && <TabsTrigger value="clone">Clone Permissions</TabsTrigger>}
        </TabsList>

        {/* Matrix Tab */}
        <TabsContent value="matrix" className="space-y-4">
          {permissionMatrix.map(({ module, permissions }) => {
            const { granted, total } = getModuleAccessCount(module.id);

            return (
              <Card key={module.id} className="overflow-hidden">
                {/* Module Header */}
                <div className="bg-muted p-4 border-b flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {getLocalizedText(module.name, currentLanguage)}
                    </h3>
                    {module.description && (
                      <p className="text-sm text-muted-foreground">
                        {getLocalizedText(module.description, currentLanguage)}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {granted}/{total}
                  </Badge>
                </div>

                {/* Actions Grid */}
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {permissions.map(({ action, hasPermission }) => (
                    <label
                      key={action.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={hasPermission}
                        onCheckedChange={(checked) =>
                          handlePermissionToggle(module.id, action.id, checked as boolean)
                        }
                        disabled={readOnly}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {getLocalizedText(action.name, currentLanguage)}
                        </p>
                        {action.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {getLocalizedText(action.description, currentLanguage)}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </Card>
            );
          })}
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              {permissionMatrix.map(({ module, permissions }) => {
                const grantedPermissions = permissions.filter(p => p.hasPermission);

                return (
                  <div key={module.id}>
                    <h3 className="font-semibold mb-3">
                      {getLocalizedText(module.name, currentLanguage)}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {grantedPermissions.length === 0 ? (
                        <Badge variant="outline" className="bg-muted">
                          {t('ui.noResults')}
                        </Badge>
                      ) : (
                        grantedPermissions.map(({ action }) => (
                          <Badge key={action.id} variant="secondary">
                            {getLocalizedText(action.name, currentLanguage)}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Clone Permissions Tab */}
        {roles.length > 1 && (
          <TabsContent value="clone" className="space-y-4">
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">
                Copy permissions from another role to this role
              </p>
              <div className="space-y-2">
                {roles.map(role => {
                  if (role.id === selectedRole.id) return null;

                  return (
                    <Button
                      key={role.id}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => handleClonePermissions(role.id, selectedRole.id)}
                    >
                      <span>{getLocalizedText(role.name, currentLanguage)}</span>
                      {copiedRoleId === role.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

/**
 * Simplified Permission Grid Component
 * For inline editing of permissions without tab interface
 */
export function PermissionGrid({
  module,
  permissions,
  selectedPermissions,
  onPermissionToggle,
  readOnly = false,
}: {
  module: Module;
  permissions: Permission[];
  selectedPermissions: Set<string>;
  onPermissionToggle?: (actionId: string, checked: boolean) => void;
  readOnly?: boolean;
}) {
  const { currentLanguage } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{getLocalizedText(module.name, currentLanguage)}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {(module.actions || []).map(action => {
          const isSelected = selectedPermissions.has(action.id);

          return (
            <label
              key={action.id}
              className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onPermissionToggle?.(action.id, checked as boolean)}
                disabled={readOnly}
              />
              <span className="text-sm truncate">
                {getLocalizedText(action.name, currentLanguage)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

interface Permission {
  id: string;
  moduleId: string;
  actionId: string;
}
