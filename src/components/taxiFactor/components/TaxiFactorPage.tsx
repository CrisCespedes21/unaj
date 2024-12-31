"use client";
import React, { useCallback, useState } from "react";
import { Calendar, Flame, Link2, Pen, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import SkeletonTable from "@/components/Layout/skeletonTable";
import CustomPagination from "@/components/Pagination";

import SelectFilter from "@/components/SelectFilter";
import { useTaxiFactorPaginate } from "../lib/taxiFactor.hook";
import { useAnio } from "@/components/combustion/lib/combustion.hook";
import { TaxiFactorCollection } from "../services/TaxiFactor.interface";
import { FormTaxiFactor } from "@/components/taxiFactor/components/CreateTaxiFactor";
import { UpdateFormTaxiFactor } from "@/components/taxiFactor/components/UpdateTaxiFactor";
import { errorToast, successToast } from "@/lib/utils/core.function";
import { deleteTaxiFactor } from "@/components/taxiFactor/services/TaxiFactor.actions";
import { ChangeTitle } from "@/components/TitleUpdater";
import Link from "next/link";

export default function TaxiFactorPage() {
  ChangeTitle("Factor de Emisión de Taxi");
  //DIALOGS
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idForUpdate, setIdForUpdate] = useState<number>(0);
  const [idForDelete, setIdForDelete] = useState<number>(0);

  const [selectAnio, setSelectAnio] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  //USE QUERIES
  const TaxiFactorQuery = useTaxiFactorPaginate({
    anioId: selectAnio,
    page,
    perPage: 10,
  });

  const aniosQuery = useAnio();

  // HANDLES
  const handleAnio = useCallback(
    async (value: string) => {
      await setPage(1);
      await setSelectAnio(value);
      await TaxiFactorQuery.refetch();
    },
    [TaxiFactorQuery]
  );

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    TaxiFactorQuery.refetch();
  }, [TaxiFactorQuery]);

  const handleCloseUpdate = useCallback(() => {
    setIsUpdateDialogOpen(false);
    TaxiFactorQuery.refetch();
  }, [TaxiFactorQuery]);

  const handleDelete = useCallback(async () => {
    try {
      const response = await deleteTaxiFactor(idForDelete);
      setIsDeleteDialogOpen(false);
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(error.response.data || error.response.data.message);
    } finally {
      await TaxiFactorQuery.refetch();
    }
  }, [TaxiFactorQuery]);

  const handleClickUpdate = (id: number) => {
    setIdForUpdate(id);
    setIsUpdateDialogOpen(true);
  };

  const handleCLickDelete = (id: number) => {
    setIdForDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handlePageChange = async (page: number) => {
    await setPage(page);
    await TaxiFactorQuery.refetch();
  };

  if (TaxiFactorQuery.isLoading || aniosQuery.isLoading) {
    return <SkeletonTable />;
  }

  return (
    <div className="w-full max-w-screen-xl h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-center mb-6">
        <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
            <SelectFilter
              list={aniosQuery.data!}
              itemSelected={selectAnio}
              handleItemSelect={handleAnio}
              value={"id"}
              nombre={"nombre"}
              id={"id"}
              all={true}
              icon={<Calendar className="h-3 w-3" />}
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-7 gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Registrar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg border-2">
                <DialogHeader>
                  <DialogTitle>Factor de Taxie</DialogTitle>
                  <DialogDescription>
                    Agregar un nuevo Factor de Emisión para el Taxi
                  </DialogDescription>
                  <DialogClose />
                </DialogHeader>
                <FormTaxiFactor onClose={handleClose} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                N°
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                FACTOR <span className="text-[10px]">[kgCO2/km]</span>
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                AÑO
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                FUENTE
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TaxiFactorQuery.data!.data.map(
              (item: TaxiFactorCollection, index: number) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary">{index + 1}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="default"> {item.factor}</Badge>
                  </TableCell>

                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary"> {item.anio}</Badge>
                  </TableCell>

                  <TableCell className="text-xs sm:text-sm">
                    {item.fuente}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm p-1">
                    <div className="flex justify-center gap-4">
                      {item.link && (
                        <Link href={item.link} target="_blank">
                          <Button
                            className="h-7 flex items-center gap-2"
                            size="sm"
                            variant="secondary"
                          >
                            <Link2 className="h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                      {/*UPDATE*/}
                      <Button
                        className="h-7 w-7"
                        size="icon"
                        variant="outline"
                        onClick={() => handleClickUpdate(item.id)}
                      >
                        <Pen className="h-3.5 text-primary" />
                      </Button>

                      {/*DELETE*/}
                      <Button
                        className="h-7 w-7"
                        size="icon"
                        variant="outline"
                        onClick={() => handleCLickDelete(item.id)}
                      >
                        <Trash2 className="h-3.5 text-gray-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        {TaxiFactorQuery.data!.meta.totalPages > 1 && (
          <CustomPagination
            meta={TaxiFactorQuery.data!.meta}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/*MODAL UPDATE*/}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Registro</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <UpdateFormTaxiFactor onClose={handleCloseUpdate} id={idForUpdate} />
        </DialogContent>
      </Dialog>

      {/*    MODAL DELETE*/}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar registro</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer, ¿Estás seguro de eliminar este
              registro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}