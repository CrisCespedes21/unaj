"use client";

import LayoutWrapper from "@/components/Layout/layout";
import TipoPapelPage from "@/components/tipoPapel/components/TipoPapelPage";
import AreaPage from "@/components/area/components/AreaPage";
import AnioPage from "@/components/anio/components/AnioPage";


export default function Page() {
    return (
        <LayoutWrapper>
            <AnioPage/>
        </LayoutWrapper>
    );
}
