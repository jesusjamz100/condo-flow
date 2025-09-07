import { Button, Container, Grid, Typography, Card, CardContent } from "@mui/material";
import { Link } from "react-router";
import { Home, People, Payment, Receipt, Apartment, BarChart } from "@mui/icons-material";

const features = [
  {
    icon: <People fontSize="large" sx={{ color: "white" }} />,
    title: "Gestión de Residentes",
    description: "Administra la información de todos los residentes de forma centralizada y segura."
  },
  {
    icon: <Payment fontSize="large" sx={{ color: "white" }} />,
    title: "Pagos",
    description: "Registra, aprueba y consulta pagos de forma rápida y transparente."
  },
  {
    icon: <Receipt fontSize="large" sx={{ color: "white" }} />,
    title: "Facturas",
    description: "Genera y consulta facturas con cálculos automáticos de alícuotas y descuentos."
  },
  {
    icon: <Apartment fontSize="large" sx={{ color: "white" }} />,
    title: "Apartamentos",
    description: "Consulta y administra la información de cada apartamento, su balance y ocupantes."
  },
  {
    icon: <BarChart fontSize="large" sx={{ color: "white" }} />,
    title: "Métricas",
    description: "Visualiza métricas y reportes para tomar decisiones informadas."
  },
  {
    icon: <Home fontSize="large" sx={{ color: "white" }} />,
    title: "Gastos",
    description: "Registra y controla los gastos generales, por torre o sector."
  }
];

const HomePage = () => {
  return (
    <div>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
            <Container maxWidth="lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    {/* Texto */}
                    <div className="text-center md:text-left">
                        <Typography
                            variant="h2"
                            fontWeight="bold"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                lineHeight: 1.2,
                            }}
                        >
                            <span className="text-blue-600">Condo</span>
                            <span className="text-green-700">Flow</span>
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            paragraph
                            sx={{ maxWidth: 500, margin: "0 auto" }}
                        >
                            La plataforma integral para la gestión de condominios: residentes, pagos, gastos, facturas, apartamentos y métricas en un solo lugar.
                        </Typography>

                        <div className="flex justify-center md:justify-start gap-4 mt-8 flex-wrap">
                            <Button
                                component={Link}
                                to="/dashboard"
                                variant="contained"
                                sx={{
                                    backgroundColor: "#2563eb",
                                    "&:hover": { backgroundColor: "#1d4ed8" },
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    px: 3,
                                    py: 1.5,
                                    boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Panel Residente
                            </Button>
                            <Button
                                component={Link}
                                to="/admin/dashboard"
                                variant="contained"
                                sx={{
                                    backgroundColor: "#16a34a",
                                    "&:hover": { backgroundColor: "#15803d" },
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    px: 3,
                                    py: 1.5,
                                    boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Panel Administrador
                            </Button>
                        </div>
                    </div>

                    {/* Imagen / Mockup */}
                    <div className="hidden md:flex justify-center">
                        <img
                            src="/images/dashboard-mockup.png"
                            alt="Vista previa CondoFlow"
                            className="rounded-xl shadow-lg border border-gray-200 max-w-full"
                        />
                    </div>
                </div>
            </Container>
        </section>

        {/* Metricas */}
        <section className="py-12 bg-white">
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">
                    {[
                        { value: "500+", label: "Residentes gestionados" },
                        { value: "1200+", label: "Pagos procesados" },
                        { value: "99%", label: "Satisfacción de usuarios" },
                    ].map((stat, idx) => (
                        <Grid item xs={12} sm={4} key={idx} className="text-center">
                            <Typography variant="h3" sx={{ fontWeight: 800, color: idx % 2 === 0 ? "#2563eb" : "#16a34a" }}>
                                {stat.value}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {stat.label}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
            <Container maxWidth="lg">
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    textAlign="center"
                    gutterBottom
                    sx={{ fontWeight: 800 }}
                >
                    Todo lo que necesitas para tu condominio
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign="center"
                    mb={8}
                    sx={{ maxWidth: 600, mx: "auto" }}
                >
                    CondoFlow simplifica la administración y comunicación en tu comunidad.
                </Typography>

                <Grid container spacing={4} alignItems="stretch" justifyContent="center">
                    {features.map((feature, idx) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={idx}
                            data-aos="fade-up"
                            data-aos-delay={idx * 100}
                            sx={{
                                display: "flex",
                                flexBasis: { md: "33.3333%" }, // fuerza 3 columnas en desktop
                                maxWidth: { md: "33.3333%" },  // evita que se pase del ancho
                            }}
                        >
                            <Card
                                sx={{
                                    flexGrow: 1,
                                    width: "100%",
                                    minHeight: 280,
                                    borderRadius: 3,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                    textAlign: "center",
                                    p: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-6px)",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                <div
                                    className="flex items-center justify-center mb-4"
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: "50%",
                                        backgroundColor: idx % 2 === 0 ? "#2563eb" : "#16a34a",
                                    }}
                                >
                                    {feature.icon}
                                </div>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{ fontWeight: 700 }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </section>

        {/* Testimonios */}
        <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom sx={{ fontWeight: 800 }}>
                    Lo que dicen nuestros usuarios
                </Typography>
                <Grid container spacing={4} mt={4}>
                    {[
                        { name: "María López", role: "Administradora", text: "CondoFlow ha simplificado mi trabajo diario. Ahora todo está centralizado y es mucho más fácil comunicarme con los residentes." },
                        { name: "Carlos Pérez", role: "Residente", text: "Puedo ver mis facturas y pagar en segundos. La transparencia y rapidez son increíbles." },
                    ].map((t, idx) => (
                        <Grid item xs={12} md={6} key={idx}>
                            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                                <Typography variant="body1" color="text.secondary" mb={2}>
                                    “{t.text}”
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{t.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </section>

        <section className="py-16 bg-blue-600 text-white text-center">
            <Container maxWidth="md">
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    ¿Listo para optimizar la gestión de tu condominio?
                </Typography>
                <Typography variant="body1" mb={4}>
                    Únete a CondoFlow y lleva la administración de tu comunidad al siguiente nivel.
                </Typography>
                <div className="flex justify-center gap-4 flex-wrap">
                    <Button
                        component={Link}
                        to="/dashboard"
                        variant="contained"
                        sx={{
                            backgroundColor: "#16a34a",
                            "&:hover": { backgroundColor: "#15803d" },
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: "bold",
                            px: 3,
                            py: 1.5,
                        }}
                    >
                        Panel Residente
                    </Button>
                    <Button
                        component={Link}
                        to="/admin/dashboard"
                        variant="outlined"
                        sx={{
                            borderColor: "white",
                            color: "white",
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: "bold",
                            px: 3,
                            py: 1.5,
                        }}
                    >
                        Panel Administrador
                    </Button>
                </div>
            </Container>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 py-6">
            <Container maxWidth="lg" className="text-center">
            <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} CondoFlow. Todos los derechos reservados.
            </Typography>
            </Container>
        </footer>
    </div>
  );
};

export default HomePage;