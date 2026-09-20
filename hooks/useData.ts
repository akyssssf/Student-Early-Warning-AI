import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createIntervention, createStudent, deleteStudent, fetchInterventions, fetchRisks, fetchStudents, updateStudent } from "@/lib/api";
import type { StudentInput, InterventionInput } from "@/lib/schemas";
import { asStudentId, type Student } from "@/lib/types";

export function useStudentsQuery() { return useQuery({ queryKey: ["students"], queryFn: fetchStudents, staleTime: 60_000, gcTime: 5 * 60_000 }); }
export function useRisksQuery() { return useQuery({ queryKey: ["risks"], queryFn: fetchRisks, staleTime: 30_000, gcTime: 5 * 60_000 }); }
export function useInterventionsQuery() { return useQuery({ queryKey: ["interventions"], queryFn: fetchInterventions, staleTime: 15_000, gcTime: 5 * 60_000 }); }

function toStudent(input: StudentInput): Student { return { ...input, nim: asStudentId(input.nim) }; }

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: StudentInput) => createStudent(toStudent(payload)), onSuccess: async () => { await Promise.all([qc.invalidateQueries({ queryKey: ["students"] }), qc.invalidateQueries({ queryKey: ["risks"] })]); } });
}
export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: StudentInput) => updateStudent(toStudent(payload)), onSuccess: async () => { await Promise.all([qc.invalidateQueries({ queryKey: ["students"] }), qc.invalidateQueries({ queryKey: ["risks"] })]); } });
}
export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (nim: string) => deleteStudent(nim), onSuccess: async () => { await Promise.all([qc.invalidateQueries({ queryKey: ["students"] }), qc.invalidateQueries({ queryKey: ["risks"] })]); } });
}
export function useCreateIntervention() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: InterventionInput) => createIntervention(payload), onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["interventions"] }); } });
}
