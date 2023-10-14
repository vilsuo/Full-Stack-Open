import { LocalHospital, MonitorHeart, Work } from '@mui/icons-material';
import { assertNever } from "../../utils";
import { Entry } from '../../types';

interface TypeProps {
  type: Entry["type"];
}

const TypeIcon = ({ type } : TypeProps) => {
  switch (type) {
    case "HealthCheck":
      return <MonitorHeart />;
    case "Hospital":
      return <LocalHospital />;
    case "OccupationalHealthcare":
      return <Work />;
    default:
      return assertNever(type);
  }
};

export default TypeIcon;