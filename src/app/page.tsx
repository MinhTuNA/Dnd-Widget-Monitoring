'use client';
import Link from "next/link";
import Login from "./(guest)/auth/login/page";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllTables } from "@/lib/services/API_service";

export default function Home() {


  return (
    <Login></Login>
  );
}
