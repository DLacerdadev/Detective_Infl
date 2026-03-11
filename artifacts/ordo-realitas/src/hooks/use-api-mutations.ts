import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateCharacter,
  useUpdateCharacter,
  useDeleteCharacter,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  useCreateOrigin,
  useUpdateOrigin,
  useDeleteOrigin,
  useCreatePericia,
  useUpdatePericia,
  useDeletePericia,
  useCreateRitual,
  useUpdateRitual,
  useDeleteRitual,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  useUpdateUserRole,
  getListCharactersQueryKey,
  getGetCharacterQueryKey,
  getListClassesQueryKey,
  getListOriginsQueryKey,
  getListPericiasQueryKey,
  getListRitualsQueryKey,
  getListItemsQueryKey,
  getListAdminUsersQueryKey,
} from "@workspace/api-client-react";

// Wrappers around the generated hooks to add automatic cache invalidation
export function useCreateCharacterMut() {
  const qc = useQueryClient();
  return useCreateCharacter({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListCharactersQueryKey() }) }
  });
}

export function useUpdateCharacterMut(id: string) {
  const qc = useQueryClient();
  return useUpdateCharacter({
    mutation: { 
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListCharactersQueryKey() });
        qc.invalidateQueries({ queryKey: getGetCharacterQueryKey(id) });
      }
    }
  });
}

export function useDeleteCharacterMut() {
  const qc = useQueryClient();
  return useDeleteCharacter({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListCharactersQueryKey() }) }
  });
}

// Admin Entity Mutations
export function useCreateClassMut() {
  const qc = useQueryClient();
  return useCreateClass({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListClassesQueryKey() }) } });
}
export function useUpdateClassMut() {
  const qc = useQueryClient();
  return useUpdateClass({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListClassesQueryKey() }) } });
}
export function useDeleteClassMut() {
  const qc = useQueryClient();
  return useDeleteClass({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListClassesQueryKey() }) } });
}

export function useCreateOriginMut() {
  const qc = useQueryClient();
  return useCreateOrigin({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListOriginsQueryKey() }) } });
}
export function useUpdateOriginMut() {
  const qc = useQueryClient();
  return useUpdateOrigin({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListOriginsQueryKey() }) } });
}
export function useDeleteOriginMut() {
  const qc = useQueryClient();
  return useDeleteOrigin({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListOriginsQueryKey() }) } });
}

export function useCreatePericiaMut() {
  const qc = useQueryClient();
  return useCreatePericia({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListPericiasQueryKey() }) } });
}
export function useUpdatePericiaMut() {
  const qc = useQueryClient();
  return useUpdatePericia({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListPericiasQueryKey() }) } });
}
export function useDeletePericiaMut() {
  const qc = useQueryClient();
  return useDeletePericia({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListPericiasQueryKey() }) } });
}

export function useCreateRitualMut() {
  const qc = useQueryClient();
  return useCreateRitual({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListRitualsQueryKey() }) } });
}
export function useUpdateRitualMut() {
  const qc = useQueryClient();
  return useUpdateRitual({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListRitualsQueryKey() }) } });
}
export function useDeleteRitualMut() {
  const qc = useQueryClient();
  return useDeleteRitual({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListRitualsQueryKey() }) } });
}

export function useCreateItemMut() {
  const qc = useQueryClient();
  return useCreateItem({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListItemsQueryKey() }) } });
}
export function useUpdateItemMut() {
  const qc = useQueryClient();
  return useUpdateItem({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListItemsQueryKey() }) } });
}
export function useDeleteItemMut() {
  const qc = useQueryClient();
  return useDeleteItem({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListItemsQueryKey() }) } });
}

export function useUpdateUserRoleMut() {
  const qc = useQueryClient();
  return useUpdateUserRole({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListAdminUsersQueryKey() }) } });
}
