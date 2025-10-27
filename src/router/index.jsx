import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/organisms/Layout";

// Lazy load pages
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Assignments = lazy(() => import("@/components/pages/Assignments"));
const Calendar = lazy(() => import("@/components/pages/Calendar"));
const Schedule = lazy(() => import("@/components/pages/Schedule"));
const Courses = lazy(() => import("@/components/pages/Courses"));
const Grades = lazy(() => import("@/components/pages/Grades"));
const Students = lazy(() => import("@/components/pages/Students"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Dashboard />
      </Suspense>
    )
  },
  {
    path: "assignments",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Assignments />
      </Suspense>
    )
  },
{
    path: "calendar",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Calendar />
      </Suspense>
    )
  },
  {
    path: "schedule",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Schedule />
      </Suspense>
    )
  },
  {
    path: "courses",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Courses />
      </Suspense>
    )
  },
  {
    path: "grades",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Grades />
      </Suspense>
    )
  },
{
    path: "students",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Students />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);