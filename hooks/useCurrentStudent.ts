"use client";

import { useEffect, useMemo, useState } from "react";
import { useStudentsQuery } from "@/hooks/useData";
import { buildCurrentStudent, resolveStudentAccount, type StudentAccount } from "@/lib/currentStudent";
import { COOKIE, readCookie } from "@/lib/session";

/** Mahasiswa yang sedang login, dengan data akademik terbaru dari API. */
export function useCurrentStudent() {
  const [account, setAccount] = useState<StudentAccount | null | undefined>(undefined);
  const students = useStudentsQuery();

  useEffect(() => {
    setAccount(resolveStudentAccount());
  }, []);

  const student = useMemo(() => {
    if (!account) return null;
    return buildCurrentStudent(account, students.data ?? []);
  }, [account, students.data]);

  const isLoading = account === undefined || (account !== null && students.isLoading);
  const isError = account === null || students.isError;

  return { student: isError ? null : student, isLoading, isError };
}

/** Mahasiswa yang dipantau akun Orang Tua (dipilih saat login). Tidak ada fallback ke mahasiswa lain. */
export function useLinkedStudent() {
  const [nim, setNim] = useState<string | undefined>(undefined);
  const students = useStudentsQuery();

  useEffect(() => {
    setNim(readCookie(COOKIE.nim));
  }, []);

  const student = useMemo(
    () => (nim ? (students.data ?? []).find((item) => String(item.nim) === nim) ?? null : null),
    [nim, students.data],
  );

  return {
    student,
    isLoading: nim === undefined || students.isLoading,
    isError: students.isError,
  };
}
