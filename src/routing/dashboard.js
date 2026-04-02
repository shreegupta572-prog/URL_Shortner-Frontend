import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./routeTree"
import Dashboard from "../pages/Dashboard"

export const dasboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: Dashboard
})