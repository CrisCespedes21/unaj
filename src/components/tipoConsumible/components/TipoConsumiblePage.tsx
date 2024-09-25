"use client";

import {useCallback, useState} from "react";
import SelectFilter from "@/components/SelectFilter";
import {Pen, Plus, Trash2, Bean} from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Button, buttonVariants} from "@/components/ui/button";
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
import {Badge} from "@/components/ui/badge";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {CreateFormTipoConsumible} from "./CreateFormTipoConsumible";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {UpdateFormTipoConsumible} from "@/components/tipoConsumible/components/UpdateFormTipoConsumible";
import {useTipoConsumible} from "@/components/consumibles/lib/consumible.hook";
import {deleteTipoConsumible} from "@/components/tipoConsumible/services/tipoConsumible.actions";
import {TipoConsumibleCollection} from "@/components/tipoConsumible/services/tipoConsumible.interface";

export default function TipoConsumiblePage() {
    //DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    //IDS
    const [idForUpdate, setIdForUpdate] = useState<number>(0);
    const [idForDelete, setIdForDelete] = useState<number>(0);

    const COLUMS = [
        "N°",
        "NOMBRE",
        "UNIDAD",
        "DESCRIPCION",
        "CATEGORIA",
        "GRUPO",
        "PROCESO",
        "ACCIONES",
    ];


    //USE QUERIES
    const tipoConsumibleQuery = useTipoConsumible();

    // HANDLES
    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        tipoConsumibleQuery.refetch();
    }, [tipoConsumibleQuery]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        tipoConsumibleQuery.refetch();
    }, [tipoConsumibleQuery]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteTipoConsumible(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(
                error.response?.data?.message || "Error al eliminar el tipo de fertilizante"
            );
        } finally {
            await tipoConsumibleQuery.refetch();
        }
    }, [tipoConsumibleQuery]);
    const handleClickUpdate = (id: number) => {
        setIdForUpdate(id);
        setIsUpdateDialogOpen(true);
    };

    const handleCLickDelete = (id: number) => {
        setIdForDelete(id);
        setIsDeleteDialogOpen(true);
    };

    if (tipoConsumibleQuery.isLoading) {
        return <SkeletonTable/>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-foreground font-bold">Tipos de Consumible</h1>
                    <h2 className="text-xs sm:text-sm text-muted-foreground">Huella de carbono</h2>
                </div>
                <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
                    <div
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center sm:w-full w-1/2">

                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <Plus className="h-3.5 w-3.5"/>
                                    Registrar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg border-2">
                                <DialogHeader>
                                    <DialogTitle> TIPOS DE FERTILIZANTE</DialogTitle>
                                    <DialogDescription>
                                        Agregar Tipo de Consumible
                                    </DialogDescription>
                                    <DialogClose/>
                                </DialogHeader>
                                <CreateFormTipoConsumible onClose={handleClose}/>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {
                                COLUMS.map((item) => (
                                    <TableHead key={item} className="text-xs sm:text-sm font-bold text-center">
                                        {item}
                                    </TableHead>
                                ))
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tipoConsumibleQuery.data!.map(
                            (item: TipoConsumibleCollection, index: number) => (
                                <TableRow key={item.id} className="text-center">
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">{index + 1}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.nombre}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.unidad}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.descripcion}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.categoria}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.grupo}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.proceso}
                                    </TableCell>

                                    <TableCell className="text-xs sm:text-sm p-1">
                                        <div className="flex justify-center gap-4">
                                            {/*UPDATE*/}
                                            <Button
                                                className="h-7 w-7"
                                                size="icon"
                                                variant="outline"
                                                onClick={() => handleClickUpdate(item.id)}
                                            >
                                                <Pen className="h-3.5 text-blue-700"/>
                                            </Button>

                                            {/*DELETE*/}
                                            <Button
                                                className="h-7 w-7"
                                                size="icon"
                                                variant="outline"
                                                onClick={() => handleCLickDelete(item.id)}
                                            >
                                                <Trash2 className="h-3.5 text-gray-500"/>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de Consumible</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <UpdateFormTipoConsumible onClose={handleCloseUpdate} id={idForUpdate}/>
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
                            className={buttonVariants({variant: "destructive"})}
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
