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
import {Button} from "../../ui/button";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {useQuery} from "@tanstack/react-query";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {
    ConsumibleFactorRequest,
    CreateConsumibleFactorProps
} from "@/components/tipoConsumible/services/tipoConsumibleFactor.interface";
import {createFactorEmisionConsumible} from "@/components/tipoConsumible/services/tipoConsumibleFactor.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getTiposConsumible} from "@/components/tipoConsumible/services/tipoConsumible.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoConsumibleFactor = z.object({
    factor: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    tipoConsumibleId: z.string().min(1, "Seleccione un tipo de consumible"),
    anioId: z.string().min(1, "Seleccione un año"),
    fuente: z.string().min(1, "Ingrese una fuente"),
    link: z.string().optional(),
});

export function CreateFormTipoConsumibleFactor({
                                                   onClose,
                                               }: CreateConsumibleFactorProps) {
    const form = useForm<z.infer<typeof TipoConsumibleFactor>>({
        resolver: zodResolver(TipoConsumibleFactor),
        defaultValues: {
            factor: 0,
            tipoConsumibleId: "",
            anioId: "",
            fuente: "",
            link: "",
        },
    });

    const tiposConsumible = useQuery({
        queryKey: ["tipoConsumibleFactorC"],
        queryFn: () => getTiposConsumible(),
        refetchOnWindowFocus: false,
    });

    const anios = useQuery({
        queryKey: ["aniosFC"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof TipoConsumibleFactor>) => {
        const TipoConsumibleFactorRequest: ConsumibleFactorRequest = {
            factor: data.factor,
            tipoConsumibleId: parseNumber(data.tipoConsumibleId),
            anioId: parseNumber(data.anioId),
            fuente: data.fuente,
            link: data.link,
        };
        try {
            const response = await createFactorEmisionConsumible(TipoConsumibleFactorRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (tiposConsumible.isLoading) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center max-w-md">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/*TIPO DE CONSUMIBLE*/}
                        <FormField
                            name="tipoConsumibleId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Tipo Consumible</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tipo Consumible"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposConsumible.data!.map((tipoConsumible) => (
                                                    <SelectItem key={tipoConsumible.id}
                                                                value={tipoConsumible.id.toString()}>
                                                        {tipoConsumible.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="flex w-full gap-5">
                            {/*FACTOR*/}
                            <FormField
                                control={form.control}
                                name="factor"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="string"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="0"
                                                min={0}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/*AÑO*/}
                            <FormField
                                name="anioId"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Año</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Año"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {anios.data!.map((anio) => (
                                                        <SelectItem key={anio.id}
                                                                    value={anio.id.toString()}>
                                                            {anio.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/*FUENTE*/}
                        <FormField
                            control={form.control}
                            name="fuente"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Fuente</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Fuente"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/*LINK*/}
                        <FormField
                            control={form.control}
                            name="link"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Link"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 w-full pt-4">
                            <Button type="submit" className="w-full bg-blue-700">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}