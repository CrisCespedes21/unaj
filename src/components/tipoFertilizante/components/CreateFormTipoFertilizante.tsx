import React from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
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
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
    CreateTipoFertilizanteProps,
    TipoFertilizanteRequest,
} from "../services/tipoFertilizante.interface";
import {
    createTipoFertilizante,
    getClaseFertilizante,
} from "../services/tipoFertilizante.actions";
import {useQuery} from "@tanstack/react-query";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {STEP_NUMBER} from "@/lib/constants/menu";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoFertilizante = z.object({
    nombre: z.string().min(1, requiredMessage("nombre")),
    clase: z.string().min(1, requiredMessage("clase")),
    porcentaje_nitrogeno: z.preprocess(parseNumber, z.number().min(1, requiredMessage("% de nitrogeno mayor a 1"))),
    unidad: z.string().min(1, requiredMessage("unidad")),
});

export function CreateFormTipoFertilizante({
                                               onClose,
                                           }: CreateTipoFertilizanteProps) {
    const form = useForm<z.infer<typeof TipoFertilizante>>({
        resolver: zodResolver(TipoFertilizante),
        defaultValues: {
            nombre: "",
            porcentaje_nitrogeno: 0,
            unidad: "",
            clase: "",
        },
    });

    const claseQuery = useQuery({
        queryKey: ["clases"],
        queryFn: () => getClaseFertilizante(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof TipoFertilizante>) => {
        const TipoFertilizanteRequest: TipoFertilizanteRequest = {
            nombre: data.nombre,
            porcentajeNitrogeno: data.porcentaje_nitrogeno,
            unidad: data.unidad,
            clase: data.clase,
        };
        try {
            const response = await createTipoFertilizante(TipoFertilizanteRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (claseQuery.isFetching || claseQuery.isError) {
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
                            name="nombre"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Nombre del tipo de papel"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="clase"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Clase</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleciona la clase"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                            <SelectGroup>
                                                {claseQuery.data!.map((clase) => (
                                                    <SelectItem key={clase.nombre} value={clase.nombre.toString()}>
                                                        {clase.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-5">
                            {/*PORCENTAJE DE NITROGENO*/}
                            <FormField
                                control={form.control}
                                name="porcentaje_nitrogeno"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Porcentaje de Nitrogeno</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                type="number"
                                                step={STEP_NUMBER}
                                                min={0}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/*UNIDAD*/}
                            <FormField
                                control={form.control}
                                name="unidad"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Unidad</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Unidad "
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

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
