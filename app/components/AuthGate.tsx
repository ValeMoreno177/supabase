"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import BottomNav from "./BottomNav";

/**
 * Protege la app: sin sesión te manda a /auth/login.
 * En /auth/* no se muestra la barra inferior; con sesión iniciada,
 * entrar a /auth/* te lleva al inicio.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
      setChecked(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!checked) return;
    if (!loggedIn && !isAuthPage) router.replace("/auth/login");
    if (loggedIn && isAuthPage) router.replace("/");
  }, [checked, loggedIn, isAuthPage, router]);

  // Mientras se comprueba la sesión o se redirige, no se muestra contenido
  if (!checked) return <div className="min-h-screen bg-background" />;
  if (!loggedIn && !isAuthPage) return null;
  if (loggedIn && isAuthPage) return null;

  return (
    <>
      <div className={isAuthPage ? "" : "pb-20"}>{children}</div>
      {!isAuthPage && <BottomNav />}
    </>
  );
}
