import React from "react";
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
import {errorToast, successToast} from "@/lib/utils/core.function";
import {
    CreateCategoriaActivoProps,
    CategoriaActivoRequest
} from "@/components/tipoActivo/services/categoriaActivo.interface";
import {createCategoriaActivo} from "@/components/tipoActivo/services/categoriaActivo.actions";

const CategoriaActivo = z.object({
    nombre: z.string().min(0, "Ingrese un nombre"),
});

export function CreateFormCategoriaActivo({
                                              onClose,
                                          }: CreateCategoriaActivoProps) {
    const form = useForm<z.infer<typeof CategoriaActivo>>({
        resolver: zodResolver(CategoriaActivo),
        defaultValues: {},
    });

    const onSubmit = async (data: z.infer<typeof CategoriaActivo>) => {
        const CategoriaActivoRequest: CategoriaActivoRequest = {
            nombre: data.nombre,
            grupoActivoId: 1,
        };
        try {
            const response = await createCategoriaActivo(CategoriaActivoRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

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
