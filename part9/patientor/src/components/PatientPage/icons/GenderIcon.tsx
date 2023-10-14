import { Gender } from "../../../types";
import { Male, Female, QuestionMark } from '@mui/icons-material';
import { assertNever } from "../../../utils";

interface Props {
  gender: Gender;
}

const GenderIcon = ({ gender } : Props) => {
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