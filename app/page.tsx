import { IotControl } from "./components/iot-control"
// ou
import IotControl from "./components/iot-control"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeIcon, UsersIcon, WalletIcon, ListTodoIcon, ShoppingCartIcon, LightbulbIcon } from "lucide-react"

// Corrigido: imports como named exports
import { Dashboard } from "./components/dashboard"
import { MemberWallet } from "./components/member-wallet"
import { FamilySettings } from "./components/family-settings"
import { TasksList } from "./components/tasks-list"
import { ShoppingList } from "./components/shopping-list"
import { IotControl } from "./components/iot-control"
import { LoginScreen } from "./components/login-screen"
import { FamilySetup } from "./components/family-setup"
