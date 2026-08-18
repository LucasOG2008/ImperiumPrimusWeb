import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registro único do plugin. Importar `gsap`/`ScrollTrigger` daqui em todo o app.
gsap.registerPlugin(ScrollTrigger);

// Respeita a preferência do usuário: com reduced-motion, o scrub e as animações
// de scroll são neutralizados no motion system (ver useMotionContext).
export { gsap, ScrollTrigger };
