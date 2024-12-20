"use client";
import React, {useState, useCallback, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Building, FileSpreadsheet} from "lucide-react";
import SelectFilter from "@/components/SelectFilter";
import {
    CombustionCalcResponse,
} from "@/components/combustion/services/combustionCalculate.interface";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/navigation";
import ButtonCalculate from "@/components/ButtonCalculate";
import ButtonBack from "@/components/ButtonBack";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import GenerateReport from "@/lib/utils/generateReport";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {
    useAnio,
    useCombustionCalculos,
    useCombustionCalculosReport,
    useSede
} from "@/components/combustion/lib/combustionCalculos.hooks";
import {createCombustionCalculate} from "@/components/combustion/services/combustionCalculate.actions";
import CustomPagination from "@/components/Pagination";
import {errorToast, formatPeriod, successToast} from "@/lib/utils/core.function";
import {ReportRequest} from "@/lib/interfaces/globals";
import {updateTipoCombustibleFactor} from "@/components/tipoCombustible/services/tipoCombustibleFactor.actions";
import usePageTitle from "@/lib/stores/titleStore.store";
import {ChangeTitle} from "@/components/TitleUpdater";

interface CombustionCalculateProps {
    tipo: Tipo;
}

type Tipo = "estacionaria" | "movil";

export default function CombustibleCalculate({
                                                 tipo = "estacionaria",
                                             }: CombustionCalculateProps) {
    ChangeTitle(tipo === "estacionaria" ? "Cálculos de Combustión Estacionaria" : "Cálculos de Combustión Móvil");
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [page, setPage] = useState<number>(1);

    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const combustionCalculos = useCombustionCalculos({
        tipo,
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from,
        to,
        page,
    });

    const combustionCalculosReport = useCombustionCalculosReport({
        tipo,
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from,
        to,
        page,
    });
    const sedes = useSede();
    const anios = useAnio();

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await combustionCalculos.refetch();
        await combustionCalculosReport.refetch();
    }, [combustionCalculos, combustionCalculosReport]);

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleCalculate = useCallback(async () => {
        try {
            const response = await createCombustionCalculate({
                tipo,
                sedeId: selectedSede ? Number(selectedSede) : undefined,
                from,
                to,
            });
            successToast(response.message);
        } catch (error: any) {
            console.error(error);
            errorToast(error.response?.data.message);
        }
        combustionCalculos.refetch();
        combustionCalculosReport.refetch();
    }, [tipo, selectedSede, from, to, combustionCalculos, combustionCalculosReport]);

    const handleCombustion = () => {
        push("/combustion-" + tipo);
    };

    const handleFromChange = useCallback(async (value: string) => {
        await setPage(1);
        await setFrom(value);
        await combustionCalculos.refetch();
        await combustionCalculosReport.refetch();
    }, [combustionCalculos, combustionCalculosReport]);

    const handleToChange = useCallback(async (value: string) => {
        await setPage(1);
        await setTo(value);
        await combustionCalculos.refetch();
        await combustionCalculosReport.refetch();
    }, [combustionCalculos, combustionCalculosReport]);

    const handlePageChange = useCallback(async (page: number) => {
        await setPage(page);
        await combustionCalculos.refetch();
        await combustionCalculosReport.refetch();
    }, [combustionCalculos]);

    const handleClickExcelReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10},
            {header: "TIPO DE COMBUSTIBLE", key: "tipoCombustible", width: 40},
            {header: "CONSUMO", key: "consumo", width: 20},
            {header: "UNIDAD", key: "unidad", width: 10},
            {header: "EMISIONES DE CO2", key: "emisionCO2", width: 25},
            {header: "EMISIONES DE CH4", key: "emisionCH4", width: 25},
            {header: "EMISIONES DE N2O", key: "emisionN2O", width: 25},
            {header: "TOTAL GEI", key: "totalGEI", width: 20},
            {header: "SEDE", key: "sede", width: 20},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await combustionCalculosReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period, true), `REPORTE DE CALCULOS DE COMBUSTIBLE ${tipo.toUpperCase()}`, `COMBUSTIBLE-${tipo.toUpperCase()}`);
    }

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (combustionCalculos.isLoading || sedes.isLoading || anios.isLoading || combustionCalculosReport.isLoading) {
        return <SkeletonTable/>;
    }

    if (combustionCalculos.isError || sedes.isError || anios.isError || combustionCalculosReport.isError) {
        return <div>Error</div>;
    }

    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-start mb-6">
                <div className="flex flex-col items-end w-full gap-2">
                    <div
                        className="grid grid-cols-2 grid-rows-1 w-full gap-2 sm:flex sm:justify-between justify-center">
                        <div
                            className="flex flex-col gap-1 w-full font-normal sm:flex-row sm:gap-2 sm:justify-start sm:items-center">
                            <ButtonBack onClick={handleCombustion}/>
                            <SelectFilter
                                list={sedes.data!}
                                itemSelected={selectedSede}
                                handleItemSelect={handleSedeChange}
                                value={"id"}
                                nombre={"name"}
                                id={"id"}
                                icon={<Building className="h-3 w-3"/>}
                            />

                            <ReportComponent
                                onSubmit={handleClickExcelReport}
                                ref={submitFormRef}
                                withMonth={true}
                                from={from}
                                to={to}
                                handleFromChange={handleFromChange}
                                handleToChange={handleToChange}
                            />
                        </div>
                        <div className="flex flex-col-reverse justify-end gap-1 w-full sm:flex-row sm:gap-2">
                            <Button
                                onClick={handleClick}
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-2 h-7"
                            >
                                <FileSpreadsheet className="h-3.5 w-3.5"/>
                                Excel
                            </Button>

                            <ExportPdfReport
                                data={combustionCalculosReport.data!.data}
                                fileName={`REPORTE CALCULOS DE COMBUSTIBLE_${formatPeriod({from, to}, true)}`}
                                columns={[
                                    {header: "N°", key: "id", width: 5},
                                    {header: "TIPO COMBUSTIBLE", key: "tipoCombustible", width: 20},
                                    {header: "CONSUMO", key: "consumo", width: 8},
                                    {header: "UNIDAD", key: "unidad", width: 2},
                                    {header: "EMISIONES CO2[tCO2eq]", key: "emisionCO2", width: 15},
                                    {header: "EMISIONES CH4[tCO2eq]", key: "emisionCH4", width: 15},
                                    {header: "EMISIONES N2O[tCO2eq]", key: "emisionN2O", width: 15},
                                    {header: "TOTAL GEI[tCO2eq]", key: "totalGEI", width: 10},
                                    {header: "SEDE", key: "sede", width: 10},
                                ]}
                                title="REPORTE DE CALCULOS DE COMBUSTIBLE"
                                period={formatPeriod({from, to}, true)}
                            />

                            <ButtonCalculate onClick={handleCalculate} variant="default" text="Calcular"/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                TIPO DE <br/>COMBUSTIBLE
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CONSUMO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                EMISIONES <br/> DE CO2 <span className="text-[10px]">[tCO2eq]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                EMISIONES <br/> DE CH4 <span className="text-[10px]">[tCO2eq]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                EMISIONES <br/> DE N2O <span className="text-[10px]">[tCO2eq]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                TOTAL EMISIONES <br/> GEI <span className="text-[10px]">[tCO2eq]</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {combustionCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
                        {combustionCalculos.data!.data.map(
                            (combustionCalculate: CombustionCalcResponse) => (
                                <TableRow className="text-center" key={combustionCalculate.id}>
                                    <TableCell className="text-xs sm:text-sm text-start">
                                        {combustionCalculate.tipoCombustible}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">
                                            {combustionCalculate.consumo} <span
                                            className="text-[10px] text-muted-foreground">{combustionCalculate.unidad}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {combustionCalculate.emisionCO2}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {combustionCalculate.emisionCH4}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {combustionCalculate.emisionN2O}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {combustionCalculate.totalGEI}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {combustionCalculos.data!.meta.totalPages > 1 && (
                    <CustomPagination meta={combustionCalculos.data!.meta} onPageChange={handlePageChange}/>
                )}
            </div>
        </div>
    );
}
