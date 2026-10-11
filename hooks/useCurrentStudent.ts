"use client";

import { useEffect, useState } from "react";
import {
  resolveCurrentStudent,
  type CurrentStudent,
} from "@/lib/currentStudent";

/**
 * Sebelumnya hook ini fetch ke /api/student/current yang mencari data
 * berdasarkan cookie `sew_nim`. Cookie itu tidak pernah dihapus saat logout,
 * jadi akun baru (mis. Tata) tetap menampilkan data Alya Putri.
 *
 * Sekarang identitas diambil dari akun yang benar-benar login.
 */
export function useCurrentStudent() {
  const [student, setStudent] = useState<CurrentStudent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const result = resolveCurrentStudent();
    setStudent(result);
    setIsError(result === null);
    setIsLoading(false);
  }, []);

  return { student, isLoading, isError };
}
