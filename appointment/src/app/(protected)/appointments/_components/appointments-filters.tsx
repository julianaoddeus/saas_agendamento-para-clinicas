"use client";

import { ListFilter, Search, SortAsc } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface AppointmentsFiltersProps {
  onFilterChange: (value: string) => void;
  onSortChange: (value: "date" | "doctor" | "patient" | "specialty") => void;
}

export default function AppointmentsFiltersAndOrderBy({
  onFilterChange,
  onSortChange,
}: AppointmentsFiltersProps) {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setShowFilter(!showFilter)}
          className={showFilter ? "bg-muted" : ""}
        >
          <ListFilter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
        {showFilter && (
          <div className="bg-background flex w-[300px] items-center gap-2 rounded-md border px-3">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="paciente, médico ou especialidade"
              className="h-9 w-full border-0 p-0 focus-visible:ring-0"
              onChange={(e) => onFilterChange(e.target.value)}
            />
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <SortAsc className="mr-2 h-4 w-4" />
            Ordenar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSortChange("date")}>
            Data
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("doctor")}>
            Nome Médico
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("patient")}>
            Nome do Paciente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("specialty")}>
            Especialidade
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
