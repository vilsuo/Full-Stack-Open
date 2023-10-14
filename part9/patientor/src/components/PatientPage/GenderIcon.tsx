import { Gender } from "../../types";
import { Male, Female, QuestionMark } from '@mui/icons-material';
import { assertNever } from "../../utils";

interface GenderProps {
  gender: Gender;
}

const GenderIcon = ({ gender } : GenderProps) => {
  switch (gender) {
    case Gender.Male:
      return <Male />;
    case Gender.Female:
      return <Female />;
    case Gender.Other:
      return <QuestionMark />;
    default:
      return assertNever(gender);
  }
};

export default GenderIcon;