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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "../../ui/button";

import {useQuery} from "@tanstack/react-query";
import {errorToast, successToast} from "@/lib/utils/core.function";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
    UpdateExtintorFactorProps,
    ExtintorFactorRequest
} from "../services/extintorFactor.interface";
import {getAnio} from "@/components/anio/services/anio.actions";
import {
    showExtintorFactor,
    updateExtintorFactor
} from "../services/extintorFactor.actions";

const UpdateExtintorFactor = z.object({
    anio: z.string().min(1, "Selecciona un año"),
    factor: z.preprocess((val) => parseFloat(val as string), z.number().min(0, "Ingresa un valor mayor a 0")),
});

export function UpdateFormExtintorFactor({id, onClose}: UpdateExtintorFactorProps) {
    const form = useForm<z.infer<typeof UpdateExtintorFactor>>({
        resolver: zodResolver(UpdateExtintorFactor),
        defaultValues: {
            anio: "",
            factor: 0,
        },
    });

    const anios = useQuery({
        queryKey: ["anio"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const extintorFactor = useQuery({
        queryKey: ["extintorFactor"],
        queryFn: () => showExtintorFactor(id),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (extintorFactor.data) {
            const factorData = await extintorFactor.data;
            form.reset({
                anio: factorData.anio_id.toString(),
                factor: factorData.factor,
            });
        }
    }, [extintorFactor.data, form]);

    useEffect(() => {
        loadForm();
    }, [loadForm]);

    const onSubmit = async (data: z.infer<typeof UpdateExtintorFactor>) => {
        const extintorFactorRequest: ExtintorFactorRequest = {
            anioId: parseInt(data.anio),
            factor: data.factor,
        };

        try {
            const response = await updateExtintorFactor(id, extintorFactorRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response?.data?.message || "Error actualizando factor de emisión");
        }
    };

    if (extintorFactor.isLoading || anios.isLoading) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form className="w-full flex flex-col gap-3 pt-2" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Año */}
                        <FormField
                            control={form.control}
                            name="anio"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Año</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el año"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {anios.data!.map((anio) => (
                                                    <SelectItem key={anio.id} value={anio.id.toString()}>
                                                        {anio.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="factor"
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Factor</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Factor de emisión CO2"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Botón Guardar */}
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
