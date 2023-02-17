import { signOut } from "next-auth/react";
import { FaChevronLeft } from "react-icons/fa";
import { useEncryptionKey } from "../contexts/EncryptionKey";
import Button from "./Button";

export default function Logout() {
  const { unset } = useEncryptionKey();

  const clickHandler = async () => {
    unset();
    await signOut();
  };

  return (
    <Button variant="secondary" onClick={clickHandler}>
      <FaChevronLeft /> Logout
    </Button>
  );
}
