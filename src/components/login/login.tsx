"use client";

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import Image from 'next/image';
import {errorToast} from "@/lib/utils/core.function";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

export default function LoginPage() {
    const {theme} = useTheme();
    const [resolvedTheme, setResolvedTheme] = useState(theme);
    useEffect(() => {
        if (theme === "system") {
            const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setResolvedTheme(darkMode ? "dark" : "light");
        } else {
            setResolvedTheme(theme);
        }
    }, [theme]);
    // CONSTANTES DE IMAGNES DE FONDO Y LOGO
    const fondo = "/img/fondoLogin.png";
    const logo = resolvedTheme === "dark" ? "/img/GIEGEI1.png" : "/img/GIEGEI.png";
    const navigation = useRouter();

    // SCHEMA DE VALIDACIÓN DE FORMULAR

    const authSchema = z.object({
        email: z.string().email("Email inválido"),
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres"),
    });

    const form = useForm({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // FUNCIÓN DE INICIO DE SESIÓN
    const submit = async (values: z.infer<typeof authSchema>) => {
        const result = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
        });

        if (!result) {
            errorToast("No se recibió una respuesta del servidor");
            return;
        }
        if (result.error) {
            errorToast(result.error);
        } else {
            navigation.push("/home");
        }
    };

    return (
        <div className="flex bg-muted dark:bg-transparent">
            <div className="w-0 sm:w-2/3">
                <Image
                    src={fondo}
                    width={2691}
                    height={1024}
                    priority
                    className="w-full h-screen object-cover"
                    alt="Fondo UNAJ"/>
            </div>
            <div className="w-full sm:w-1/3 ">
                <div className="flex items-center justify-center h-full max-w-screen-sm">
                    <div className="px-10 sm:p-8">
                        <div className="flex flex-col items-center justify-center">
                            <Image width={224} height={64} src={logo} priority className="w-56 h-16 mb-14"
                                   alt="Logo UNAJ"/>
                            <h2 className="text-2xl font-bold mb-2">
                                Iniciar Sesión
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Bienvenido a la UNAJ Virtual, por favor inicie sesión para
                                continuar.
                            </p>
                            <Form {...form}>
                                <form
                                    className="pt-4 w-full flex flex-col gap-2"
                                    onSubmit={form.handleSubmit(submit)}
                                >
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="mail@unaj.edu.pe" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="*********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="mt-6 w-full">
                                        Iniciar Sesión
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
