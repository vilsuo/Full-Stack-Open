
import {
  //CoursePartBase,
  //CoursePartDescription,
  CoursePart
} from "../types";

/*
interface BaseProps {
  coursePartBase: CoursePartBase;
}

const Base = ({ coursePartBase }: BaseProps) => {
  return <strong>{coursePartBase.name} {coursePartBase.exerciseCount}</strong>
};

interface DescriptionProps {
  coursePartDescription: CoursePartDescription;
}

const Description = ({ coursePartDescription }: DescriptionProps) => {
  return (
    <>
      <Base coursePartBase={baseProps} />
      <em>{coursePartDescription.description}</em>
    </>
  );
};
*/

interface PartProps {
  coursePart: CoursePart;
}

const margin = { marginBottom: 15};

const Part = ({ coursePart }: PartProps) => {
  switch (coursePart.kind) {
    case "basic":
      return (
        <div style={margin}>
          <strong>{coursePart.name} {coursePart.exerciseCount}</strong><br/>
          <em>{coursePart.description}</em>
        </div>
      );
    
    case "group":
      return (
        <div style={margin}>
          <strong>{coursePart.name} {coursePart.exerciseCount}</strong><br/>
          project exercises {coursePart.groupProjectCount}
        </div>
      );

    case "background":
      return (
        <div style={margin}>
          <strong>{coursePart.name} {coursePart.exerciseCount}</strong><br/>
          <em>{coursePart.description}</em><br/>
          submit to {coursePart.backgroundMaterial}
        </div>
      );

    case "special":
      return (
        <div style={margin}>
          <strong>{coursePart.name} {coursePart.exerciseCount}</strong><br/>
          <em>{coursePart.description}</em><br/>
          required skills: {coursePart.requirements.join(', ')}
        </div>
      );

    default:
      return assertNever(coursePart);
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps) => {
  return (
    <>
      {courseParts.map((coursePart, index) => 
        <Part
          key={index}
          coursePart={coursePart}
        />
      )}
    </>
  );
};

export default Content;