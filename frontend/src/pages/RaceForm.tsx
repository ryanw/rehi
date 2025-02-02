import { useCallback } from 'react';
import { CompetitorInput, LaneInput, RaceInput } from '../api';
import styles from './RaceForm.module.css';

const DEFAULT_COMPETITOR: CompetitorInput = {
  name: '',
};

const DEFAULT_LANE: LaneInput = {
  name: '',
};

export type ChangeEventHandler = (e: React.SyntheticEvent, changes: RaceInput) => void;
export type SubmitEventHandler = (e: React.FormEvent, changes: RaceInput) => void;

export interface RaceFormProps {
  input: RaceInput;
  onChange: ChangeEventHandler;
  onSubmit: SubmitEventHandler;
}

export function RaceForm({ input, onChange, onSubmit }: RaceFormProps) {
  const onChangeInput = useCallback((e: React.ChangeEvent) => {
    const el = e.target as HTMLInputElement;
    const key = el.name;
    const value = el.type === 'number' ? parseInt(el.value, 10) : el.value;
    onChange(e, { ...input, [key]: value });
  }, [input, onChange]);

  const onChangeCompetitorInput = useCallback((e: React.SyntheticEvent, laneIndex: number) => {
    const el = e.target as HTMLInputElement;
    const key = el.name;
    const value = el.type === 'number' ? parseInt(el.value, 10) : el.value;
    const lanes = [...input.lanes];
    lanes[laneIndex] = {
      ...lanes[laneIndex],
      competitor: {
        ...(lanes[laneIndex].competitor || DEFAULT_COMPETITOR),
        [key]: value,
      }
    };
    onChange(e, { ...input, lanes });
  }, [input, onChange]);

  const onSubmitForm = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, input);
  }, [input, onSubmit]);

  const onClickAddLane = useCallback((e: React.SyntheticEvent) => {
    const lanes = updateLaneNames([...input.lanes, { ...DEFAULT_LANE }]);
    onChange(e, { ...input, lanes });
  }, [input]);

  const onClickRemoveLane = useCallback((e: React.SyntheticEvent, index: number) => {
    if (confirm(`Are you sure you want to remove ${input.lanes[index]?.name}?`)) {
      const lanes = updateLaneNames(input.lanes.filter((_, i) => i !== index));
      onChange(e, { ...input, lanes });
    }
  }, [input]);

  const laneCount = input.lanes.length;
  return (
    <div className={styles.form}>
      <h1>{input.name}</h1>
      <form onSubmit={onSubmitForm}>
        <div>
          <label htmlFor="race-name">Name</label>
          <input id="race-name" type="text" name="name" value={input.name} onChange={onChangeInput} />
        </div>
        {input.lanes.map((lane, i) =>
          <div key={lane.id ?? `lane-${i}`}>
            {lane.name}:
            <input name="name" value={lane.competitor?.name ?? ""} onChange={(e) => onChangeCompetitorInput(e, i)} />
            <input name="position" type="number" step="1" min="1" max={laneCount} value={lane.competitor?.position ?? ""} onChange={(e) => onChangeCompetitorInput(e, i)} />
            <button type="button" onClick={(e) => onClickRemoveLane(e, i)}>Remove</button>
          </div>
        )}
        <div>
          <button type="button" onClick={onClickAddLane}>Add Lane</button>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

function updateLaneNames(lanes: LaneInput[]): LaneInput[] {
  return lanes.map((lane, i) => ({
    ...lane,
    name: `Lane ${i + 1}`
  }));
}
