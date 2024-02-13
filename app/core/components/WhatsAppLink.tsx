import { WhatsApp } from "@mui/icons-material";
import { Link } from "@mui/material";

const WhatsAppLink = ({ phoneNumber }: { phoneNumber: string }) => {
  const phonePrefix = phoneNumber.replace("+", "").startsWith("52") ? "" : "52";
  const whatsappURL = `https://wa.me/${phonePrefix}${phoneNumber}`;

  return (
    <Link href={whatsappURL} target="_blank" rel="noopener noreferrer">
      <WhatsApp fontSize="small" /> {phoneNumber}
    </Link>
  );
};

export default WhatsAppLink;
