import React, {useCallback, useEffect} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl, FormDescription,
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
import SkeletonForm from "@/components/Layout/skeletonForm";
import {useExtintorId} from "../lib/extintor.hook";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {updateExtintor} from "../service/extintor.actions";
import {ExtintorRequest, UpdateExtintorProps} from "../service/extintor.interface";
import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";

const ExtintorSchema = z.object({
    consumo: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
    anio: z.string().min(1, "Seleccione un año"),
    sede: z.string().min(1, "Seleccione una sede"),
    mes: z.string().min(1, "Selecciona un Mes"),
});

export function UpdateFormExtintor({id, onClose}: UpdateExtintorProps) {
    const form = useForm<z.infer<typeof ExtintorSchema>>({
        resolver: zodResolver(ExtintorSchema),
        defaultValues: {
            consumo: 0,
            anio: "",
            sede: "",
            mes: "",
        },
    });

    const extintor = useExtintorId(id);
    const sedeQuery = useQuery({
        queryKey: ["sedesUTA"],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });

    const mesQuery = useQuery({
        queryKey: ["mesesUTA"],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });

    const anioQuery = useQuery({
        queryKey: ["aniosUTA"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(() => {
        if (extintor.data) {
            form.reset({
                consumo: extintor.data.consumo,
                anio: extintor.data.anio_id.toString(),
                sede: extintor.data.sede_id.toString(),
                mes: extintor.data.mes_id.toString(),
            });
        }
    }, [extintor.data, form]);

    useEffect(() => {
        loadForm();
    }, [loadForm]);

    const onSubmit = async (data: z.infer<typeof ExtintorSchema>) => {
        const ExtintorRequest: ExtintorRequest = {
            consumo: data.consumo,
            anio_id: Number(data.anio),
            sede_id: Number(data.sede),
            mes_id: Number(data.mes),
        };
        try {
            const response = await updateExtintor(id, ExtintorRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (
        extintor.isLoading ||
        sedeQuery.isFetching ||
        anioQuery.isFetching ||
        mesQuery.isFetching ||
        sedeQuery.isError ||
        anioQuery.isError ||
        mesQuery.isError
    ) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-3 pt-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            name="sede"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Sede</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleciona tu sede"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                            <SelectGroup>
                                                {sedeQuery.data!.map((sede) => (
                                                    <SelectItem key={sede.id} value={sede.id.toString()}>
                                                        {sede.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="anio"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Año</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Año"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                            <SelectGroup>
                                                {anioQuery.data!.map((anio) => (
                                                    <SelectItem
                                                        key={anio.id}
                                                        value={anio.id.toString()}
                                                    >
                                                        {anio.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Mes */}
                        <FormField
                            name="mes"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Mes</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Mes"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                            <SelectGroup>
                                                {mesQuery.data!.map((mes) => (
                                                    <SelectItem key={mes.id} value={mes.id.toString()}>
                                                        {mes.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* CONSUMO */}
                        <FormField
                            control={form.control}
                            name="consumo"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel> Consumo </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Consumo"
                                            step="0.000000001"
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
