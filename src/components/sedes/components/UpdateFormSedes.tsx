import React, {useCallback, useEffect, useState} from "react";
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
import {Button} from "../../ui/button";
import {useQuery} from "@tanstack/react-query";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {
    SedesRequest,
    UpdateSedesProps,
} from "@/components/sedes/services/sedes.interface";
import {
    getSedesById,
    updateSedes,
} from "@/components/sedes/services/sedes.actions";
import {getSedes} from "@/components/sede/services/sede.actions";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const requiredMessage = (field: string) => `Ingrese un ${field}`;

const Sedes = z.object({
    name: z.string().min(1, requiredMessage("nombre")),
});

export function UpdateFormSedes({id, onClose}: UpdateSedesProps) {
    const form = useForm<z.infer<typeof Sedes>>({
        resolver: zodResolver(Sedes),
        defaultValues: {
            name: "",
        },
    });

    const sedes = useQuery({
        queryKey: ["sedesForm", id],
        queryFn: () => getSedesById(id),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (sedes.data) {
            const sedesData = await sedes.data;
            form.reset({
                name: sedesData.name
            });
        }
    }, [sedes.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof Sedes>) => {
        const sedesRequest: SedesRequest = {
            name: data.name,
        };
        try {
            const response = await updateSedes(id, sedesRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data || error.response.data.message);
        }
    };

    if (sedes.isLoading) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-3 pt-2 "
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/*NOMBRE*/}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Nombre del Sedes"
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
