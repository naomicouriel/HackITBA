
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "src/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  ChevronDown,
  Lightbulb,
  Sparkles,
  Users,
  Zap,
  Rocket,
  Star,
  GraduationCap,
  Award,
  Smile,
} from "lucide-react"
import { motion } from "framer-motion"
import { NextPage } from "next"

// New vibrant color palette
// Primary: #4361ee (Vibrant Blue)
// Secondary: #3f37c9 (Deep Blue)
// Accent: #4cc9f0 (Cyan)
// Highlight: #f72585 (Pink)
// Neutral: #f8f9fa (Light Gray)
// Dark: #1d3557 (Dark Blue)

//other colors
// black: #000000
// oxford blue: #14213D
// penn blue: #011F5B

const  Home: NextPage = () => {
  const [scrollY, setScrollY] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const companies = ["EdTech Global", "LearnSmart", "Academia Future", "EduVision", "Cognitive Labs", "MindWave"]

  const parallaxStyle = {
    transform: heroRef.current
      ? `translate(${(mousePosition.x - heroRef.current.offsetWidth / 2) / 50}px, ${(mousePosition.y - heroRef.current.offsetHeight / 2) / 50}px)`
      : "none",
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] text-[#1d3557]">
      {/* Floating Elements - These will be visible throughout the page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-[#4cc9f0]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[60%] right-[15%] w-64 h-64 bg-[#f72585]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[20%] w-48 h-48 bg-[#4361ee]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1d3557]/95 via-[#1d3557]/85 to-[#3f37c9]/90"></div>
          <Image
            src="https://www.keg.com/hubfs/shutterstock_404189197%20%281%29-1.jpg"
            alt="Students learning together"
            fill
            style={{ objectFit: "cover" }}
            className="opacity-50"
          />

          {/* Animated shapes */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 8,
              ease: "easeInOut",
            }}
            className="absolute top-[20%] right-[10%] w-32 h-32 bg-[#4cc9f0]/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              rotate: [0, -8, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 10,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-[30%] left-[15%] w-48 h-48 bg-[#f72585]/20 rounded-full blur-xl"
          />
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6 inline-block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#dcd8d5] blur-lg opacity-70 rounded-full"></div>
                <div className="relative bg-[#dcd8d5] p-3 rounded-full">
                  <Image
                    src="/skale_logo_sk.jpg"
                    alt="Skale Logo"
                    width={60}
                    height={60}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
            {/* <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6 inline-block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#f72585] blur-lg opacity-70 rounded-full"></div>
                <div className="relative bg-gradient-to-r from-[#4361ee] to-[#3f37c9] p-3 rounded-full">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div> */}

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              This is{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-[#4cc9f0] drop-shadow-lg"
              >
                Skale
              </motion.span>
            </h1>

            <motion.div style={parallaxStyle} className="relative inline-block mb-8">
              <p className="text-xl md:text-2xl font-medium text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] bg-[#1d3557]/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                Lo que transforma no es el contenido
              </p>
              <p className="text-lg md:text-xl font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] bg-[#1d3557]/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                Es la experiencia.
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-[#f72585] hover:bg-[#f72585]/80 text-white border-0 text-lg px-8 shadow-lg shadow-[#f72585]/30"
                  onClick={() => {
                    document.getElementById('future-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Conocer más <ChevronDown className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-2 border-[#4cc9f0] hover:bg-[#4cc9f0] hover:text-[#1d3557] text-lg px-8"
                  onClick={() => window.open('https://youtu.be/hJ9o0FXJpig', '_blank')}
                >
                  Ver demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <ChevronDown className="h-10 w-10 text-[#4cc9f0]" />
          </motion.div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section id="future-section" className="py-24 bg-[#f8f9fa] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4cc9f0]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f72585]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#4361ee] blur-md opacity-30 rounded-full"></div>
                  <div className="relative bg-white p-3 rounded-full shadow-xl">
                    <Rocket className="h-8 w-8 text-[#4361ee]" />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#1d3557]">El futuro de la educación online</h2>
              <p className="text-lg text-[#1d3557]/70">
                Identificamos los problemas fundamentales y creamos soluciones innovadoras
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-xl border-l-4 border-[#f72585] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f72585]/5 rounded-bl-full"></div>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="bg-[#f72585]/10 p-3 rounded-full mr-4">
                    <Lightbulb className="h-8 w-8 text-[#f72585]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1d3557]">El Problema</h3>
                </div>

                <div className="relative z-10">
                  <div className="mb-6">
                    <Image
                      src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                      alt="Frustrated student"
                      width={400}
                      height={200}
                      className="rounded-lg object-cover w-full h-48"
                    />
                  </div>

                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#f72585]">•</div>
                      <p>
                        Los cursos online actuales ofrecen la misma experiencia para todos los estudiantes, ignorando
                        sus necesidades individuales.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#f72585]">•</div>
                      <p>
                        Los profesores no tienen visibilidad sobre qué conceptos generan más dificultades en sus
                        estudiantes.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#f72585]">•</div>
                      <p>Los estudiantes no reciben retroalimentación personalizada sobre sus áreas de mejora.</p>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-xl border-l-4 border-[#4cc9f0] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4cc9f0]/5 rounded-bl-full"></div>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="bg-[#4cc9f0]/10 p-3 rounded-full mr-4">
                    <Sparkles className="h-8 w-8 text-[#4cc9f0]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1d3557]">La Solución</h3>
                </div>

                <div className="relative z-10">
                  <div className="mb-6">
                    <Image
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                      alt="AI learning solution"
                      width={400}
                      height={200}
                      className="rounded-lg object-cover w-full h-48"
                    />
                  </div>

                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#4cc9f0]">•</div>
                      <p>
                        Generación automática de quizzes personalizados durante las clases para evaluar la comprensión
                        en tiempo real.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#4cc9f0]">•</div>
                      <p>
                        Análisis de datos para identificar patrones y recomendar contenido específico para cada
                        estudiante.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1 text-[#4cc9f0]">•</div>
                      <p>
                        Dashboard analítico para profesores que muestra el rendimiento individual y grupal en tiempo
                        real.
                      </p>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-[#4361ee] to-[#3f37c9] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-[#f8f9fa] rounded-b-[50%] transform translate-y-[-50%]"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-white/5 rounded-full"></div>
          <div className="absolute top-[40%] right-[10%] w-96 h-96 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-white/5 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#f72585] blur-md opacity-30 rounded-full"></div>
                <div className="relative bg-white p-3 rounded-full shadow-xl">
                  <Zap className="h-8 w-8 text-[#f72585]" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Características Principales</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Combinamos tecnología con personalización para crear una experiencia de aprendizaje única
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20"
            >
              <div className="bg-[#4cc9f0]/20 p-4 rounded-full inline-block mb-4">
                <Brain className="h-8 w-8 text-[#4cc9f0]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Quizzes con IA</h3>
              <p className="text-white/80 mb-4">
                Generación automática de quizzes en tiempo real para incentivar el engagement y la participación de
                los estudiantes en las clases.
              </p>
              <div className="mt-4">
                {/* <Image
                  src="https://images.unsplash.com/photo-1677442135136-760c813029fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
                  alt="AI technology"
                  width={300}
                  height={150}
                  className="rounded-lg object-cover w-full h-32"
                /> */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20"
            >
              <div className="bg-[#f72585]/20 p-4 rounded-full inline-block mb-4">
                <Users className="h-8 w-8 text-[#f72585]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Recomendaciones personalizadas</h3>
              <p className="text-white/80 mb-4">
                Identificación de patrones de aprendizaje individuales para ofrecer recomendaciones específicas a cada
                estudiante.
              </p>
              <div className="mt-4">
                {/* <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Data analysis"
                  width={300}
                  height={150}
                  className="rounded-lg object-cover w-full h-32"
                /> */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20"
            >
              <div className="bg-white/20 p-4 rounded-full inline-block mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Dashboard analítico</h3>
              <p className="text-white/80 mb-4">
                Visualización de datos para profesores y academias, permitiendo una evaluación continua y ajustada.
              </p>
              <div className="mt-4">
                {/* <Image
                  src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Adaptive content"
                  width={300}
                  height={150}
                  className="rounded-lg object-cover w-full h-32"
                /> */}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        {/* <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#f8f9fa"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div> */}
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#f8f9fa] relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#4361ee] blur-md opacity-30 rounded-full"></div>
                <div className="relative bg-white p-3 rounded-full shadow-xl">
                  <Award className="h-8 w-8 text-[#4361ee]" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#1d3557]">Lo que dicen nuestros usuarios</h2>
            <p className="text-lg text-[#1d3557]/70 max-w-3xl mx-auto">
              Descubrí cómo Skale está cambiando la experiencia online
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg relative"
            >
              <div className="absolute top-6 right-6 text-[#f72585]">
                <Smile className="h-6 w-6" />
              </div>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <Image
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="User testimonial"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Ana Paula Tissera</h4>
                  <p className="text-sm text-[#1d3557]/60">Profesora de Matemáticas</p>
                </div>
              </div>
              <p className="text-[#1d3557]/80">
                "Esta plataforma revolucionó mi forma de enseñar. Ahora puedo identificar exactamente qué conceptos
                necesitan refuerzo para cada estudiante."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-[#f72585] fill-[#f72585]" />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg relative"
            >
              <div className="absolute top-6 right-6 text-[#4cc9f0]">
                <Smile className="h-6 w-6" />
              </div>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <Image
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="User testimonial"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Antonio Tepsich</h4>
                  <p className="text-sm text-[#1d3557]/60">Estudiante Universitario</p>
                </div>
              </div>
              <p className="text-[#1d3557]/80">
                "Las recomendaciones personalizadas me ayudaron a mejorar en áreas donde antes tenía dificultades. Mi
                rendimiento académico aumentó significativamente."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-[#4cc9f0] fill-[#4cc9f0]" />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg relative"
            >
              <div className="absolute top-6 right-6 text-[#4361ee]">
                <Smile className="h-6 w-6" />
              </div>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <Image
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt="User testimonial"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Naomi Couriel</h4>
                  <p className="text-sm text-[#1d3557]/60">Founder de Academia de Idiomas</p>
                </div>
              </div>
              <p className="text-[#1d3557]/80">
                "La tasa de conversión de estudiantes aumentó en un 10% gracias a Skale."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-[#4361ee] fill-[#4361ee]" />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-[#f8f9fa] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#4361ee]/5 skew-y-3"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-[#1d3557]/70">Confían en Nosotros</h2>
          </motion.div>

          <div className="relative overflow-hidden py-10">
            <div className="flex animate-marquee">
              {[...companies, ...companies].map((company, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-[200px] mx-8 opacity-60 hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <div className="h-16 flex items-center justify-center bg-white p-4 rounded-lg shadow-md">
                    <span className="text-xl font-bold text-[#1d3557]">{company}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section className="py-24 bg-gradient-to-b from-[#4361ee] to-[#3f37c9] relative overflow-hidden">
        {/* Top wave */}
        <div className="absolute top-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#f8f9fa"
              fillOpacity="1"
              d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,154.7C672,128,768,96,864,96C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 15,
              ease: "easeInOut",
            }}
            className="absolute top-[20%] right-[10%] w-64 h-64 bg-white/5 rounded-full"
          />
          <motion.div
            animate={{
              y: [0, 40, 0],
              rotate: [0, -15, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 20,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-[10%] left-[5%] w-80 h-80 bg-white/5 rounded-full"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#f72585] blur-md opacity-30 rounded-full"></div>
                <div className="relative bg-white p-3 rounded-full shadow-xl">
                  <Rocket className="h-8 w-8 text-[#f72585]" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Comenzá ahora</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Sumate a la hiperpersonalización de la educación online
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="h-3 bg-[#4cc9f0]"></div>
              <div className="p-8">
                <div className="bg-[#4cc9f0]/20 p-4 rounded-full inline-block mb-4">
                  <BookOpen className="h-8 w-8 text-[#4361ee]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#1d3557]">Estudiantes</h3>
                <p className="text-[#1d3557]/70 mb-6">
                  Accede a una experiencia de aprendizaje personalizada que se adapta a tus necesidades y ritmo.
                </p>
                <div className="relative mb-8">
                  <Image
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    alt="Students learning"
                    width={400}
                    height={200}
                    className="rounded-lg object-cover w-full h-48"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-[#4cc9f0] rounded-full p-3 shadow-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#4cc9f0] mr-2" />
                    <span>Quizzes interactivos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#4cc9f0] mr-2" />
                    <span>Recomendaciones personalizadas</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#4cc9f0] mr-2" />
                    <span>Seguimiento de progreso</span>
                  </li>
                </ul>
                <Link href="/estudiante">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button className="w-full bg-[#4361ee] hover:bg-[#3f37c9] text-white">
                      Acceder como Estudiante <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="h-3 bg-[#f72585]"></div>
              <div className="p-8">
                <div className="bg-[#f72585]/20 p-4 rounded-full inline-block mb-4">
                  <Users className="h-8 w-8 text-[#f72585]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#1d3557]">Profesores</h3>
                <p className="text-[#1d3557]/70 mb-6">
                  Obtén insights valiosos sobre el rendimiento de tus estudiantes y optimiza tu enseñanza.
                </p>
                <div className="relative mb-8">
                  <Image
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    alt="Teacher with students"
                    width={400}
                    height={200}
                    className="rounded-lg object-cover w-full h-48"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-[#f72585] rounded-full p-3 shadow-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#f72585] mr-2" />
                    <span>Generación automática de quizzes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#f72585] mr-2" />
                    <span>Dashboard analítico</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#f72585] mr-2" />
                    <span>Identificación de áreas problemáticas</span>
                  </li>
                </ul>
                <Link href="/profesor">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button className="w-full bg-[#f72585] hover:bg-[#f72585]/80 text-white">
                      Acceder como Profesor <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1d3557] text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1129&q=80')] opacity-5"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="bg-[#4cc9f0] p-2 rounded-full mr-3">
                  <Brain className="h-6 w-6 text-[#1d3557]" />
                </div>
                <span className="text-xl font-bold text-white"></span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end mb-3">
                <div className="bg-white/10 p-3 rounded-lg">
                  <Image
                    src="/hackitba_logo.png?height=60&width=120"
                    alt="HackITBA Logo"
                    width={120}
                    height={60}
                    className="opacity-90"
                  />
                </div>
              </div>
              <p className="text-sm text-white/70">Cocinado en HackITBA 2025 por los Gauss N' Roses</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-8 pt-8 border-t border-white/10 text-center"
          >
            <p className="text-white/50 text-sm">© 2025 Skale. Todos los derechos reservados.</p>
          </motion.div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default Home