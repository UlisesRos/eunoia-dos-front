import { Box, Flex, Text, Link } from "@chakra-ui/react";
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const InstagramIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.534 5.847L.054 23.27a.75.75 0 00.921.921l5.426-1.48A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.95 9.95 0 01-5.073-1.382l-.363-.215-3.222.878.878-3.222-.215-.363A9.95 9.95 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
);

const SocialLink = ({ href, label, children }) => (
    <MotionBox
        as={Link}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="36px"
        h="36px"
        borderRadius="full"
        border="1px solid rgba(235,235,235,0.2)"
        color="rgba(235,235,235,0.55)"
        bg="rgba(255,255,255,0.04)"
        whileHover={{ scale: 1.12, color: 'rgba(235,235,235,0.95)', borderColor: 'rgba(235,235,235,0.5)', background: 'rgba(255,255,255,0.1)' }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.2 }}
        _hover={{ textDecoration: 'none' }}
    >
        {children}
    </MotionBox>
);

const Footer = () => {
    return (
        <MotionFlex
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            direction="column"
            align="center"
            gap={3}
        >
            {/* Tagline */}
            <Text
                fontFamily="'Playfair Display', serif"
                fontStyle="italic"
                fontSize="xs"
                color="rgba(235,235,235,0.35)"
                letterSpacing="0.06em"
                textAlign="center"
            >
                Eunoia — pensamiento positivo
            </Text>

            {/* Iconos sociales */}
            <Flex gap={2} align="center">
                <SocialLink href="https://www.instagram.com/eunoiaestudio.ros/" label="Instagram">
                    <InstagramIcon />
                </SocialLink>
                <SocialLink
                    href="https://api.whatsapp.com/send?phone=3416296495&text=Hola! Te hablo porque vi tu pagina web y me gustaria sumarme a Eunoia!"
                    label="WhatsApp"
                >
                    <WhatsAppIcon />
                </SocialLink>
            </Flex>

            {/* Crédito */}
            <MotionBox
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 0.2 }}
            >
                <Link
                    href="https://ulisesros-desarrolloweb.vercel.app/"
                    target="_blank"
                    _hover={{ textDecoration: 'none' }}
                >
                    <Text
                        fontFamily="'Questrial', sans-serif"
                        fontSize="10px"
                        color='white'
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                    >
                        Ulises Ros — Desarrollo Web
                    </Text>
                </Link>
            </MotionBox>
        </MotionFlex>
    );
};

export default Footer;
