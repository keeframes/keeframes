import styles from "./PronounsSelect.module.css";

export default function PronounsSelect({ data, ...props }) {
  return (
    <>
      <select name="pronouns" value={data.pronouns} {...props}>
        <option value="he/him">he/him</option>
        <option value="she/her">she/her</option>
        <option value="they/them">he/them</option>
        <option value="custom">custom</option>
      </select>
    </>
  );
}

PronounsSelect.Input = function Input({ data, handleChange }) {
  return (
    <>
      <div className="form-row">
        {data.pronouns === "custom" && (
          <>
            <label htmlFor="customPronouns">Custom</label>
            <input
              type="text"
              name="customPronouns"
              placeholder="Enter your pronouns"
              value={data.customPronouns || ""}
              onChange={handleChange}
              required
            />
          </>
        )}
      </div>
    </>
  );
};
