import LikertScale from "../LikertScale";

interface LikertQuestion {
  id: string;
  statement: string;
  reverse?: boolean;
  /** Optional custom scale labels (e.g. { 1: "Very easy", 5: "Very difficult" }). */
  customLabels?: { [key: number]: string };
}

interface LikertStepProps {
  title: string;
  questions: LikertQuestion[];
  data: { [key: string]: number | null };
  onChange: (field: string, value: number) => void;
}

export default function LikertStep({
  title,
  questions,
  data,
  onChange,
}: LikertStepProps) {
  return (
    <div className="w-full max-w-md space-y-6">
      <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
        {title}
      </h3>
      {questions.map((question) => (
        <LikertScale
          key={question.id}
          id={question.id}
          statement={question.statement}
          value={data[question.id] ?? null}
          onChange={(value) => onChange(question.id, value)}
          required
          reverse={question.reverse}
          customLabels={question.customLabels}
        />
      ))}
    </div>
  );
}


