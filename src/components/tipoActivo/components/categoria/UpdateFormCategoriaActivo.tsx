import React, {useCallback, useEffect} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {Input} from "@/components/ui/input";
import {Button} from "../../../ui/button";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
    CategoriaActivoRequest, UpdateCategoriaActivoProps,
} from "../../services/categoriaActivo.interface";
import {useQuery} from "@tanstack/react-query";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {
    getCategoriaActivo,
    getCategoriaActivoById, updateCategoriaActivo
} from "@/components/tipoActivo/services/categoriaActivo.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const CategoriaActivo = z.object({
    nombre: z.string().min(0, "Ingrese un nombre"),
});

export function UpdateFormCategoriaActivo({
                                              id, onClose,
                                          }: UpdateCategoriaActivoProps) {
    const form = useForm<z.infer<typeof CategoriaActivo>>({
        resolver: zodResolver(CategoriaActivo),
        defaultValues: {},
    });

    const categoriaActivo = useQuery({
        queryKey: ["categoriaActivoUF", id],
        queryFn: () => getCategoriaActivoById(id),
        refetchOnWindowFocus: false,
    });
    const categoriaes = useQuery({
        queryKey: ['categoriaesUF'],
        queryFn: () => getCategoriaActivo(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (categoriaActivo.data) {
            const categoriaActivoData = await categoriaActivo.data;
            form.reset({
                nombre: categoriaActivoData.nombre,
            });
        }
    }, [categoriaActivo.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof CategoriaActivo>) => {
        const categoriaActivoRequest: CategoriaActivoRequest = {
            nombre: data.nombre,
            grupoActivoId: 1,
        };
        try {
            const response = await updateCategoriaActivo(id, categoriaActivoRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (categoriaActivo.isLoading || categoriaes.isLoading) {
        return <SkeletonForm/>;
    }

    if (categoriaActivo.isError || categoriaes.isError) {
        onClose();
        errorToast("Error al cargar el Categoria de Activo");
    }

    return (
        <div className="flex items-center justify-center max-w-md">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-3 pt-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/*DESCRIPCION*/}
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Categoria del tipo de consumible"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 w-full pt-4">
                            <Button type="submit" className="w-full bg-primary">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
