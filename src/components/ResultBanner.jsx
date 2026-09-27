import { getDifficultyLabel } from '../utils/categories';

const ResultBanner = ({ result, item, teamNames, adjusted }) => {
  if (!result) return null;

  let headline;
  let detail;
  if (result.solved && result.team !== null && result.team !== undefined) {
    headline = `${teamNames[result.team]} gættede den!`;
    detail = `På ledetråd ${result.cluesUsed} af ${result.total} · +${result.points} point`;
  } else if (result.solved) {
    headline = 'Rigtigt!';
    detail = `Gættet på ledetråd ${result.cluesUsed} af ${result.total} · ${result.points} point`;
  } else {
    headline = `Svaret var ${item}`;
    detail = result.cluesUsed ? `Efter ${result.cluesUsed} af ${result.total} ledetråde` : 'Ingen ledetråde vendt';
  }

  return (
    <div
      role="status"
      className={`mb-6 p-4 rounded-board border ${
        result.solved
          ? 'bg-[rgba(212,168,84,0.1)] border-[rgba(212,168,84,0.3)]'
          : 'bg-[rgba(200,132,90,0.08)] border-[rgba(200,132,90,0.2)]'
      }`}
    >
      <p className={`font-heading text-lg font-bold ${result.solved ? 'text-board-gold' : 'text-board-special'}`}>{headline}</p>
      <p className="text-sm text-board-text-secondary mt-0.5">{detail}</p>
      {adjusted && (
        <p className="text-xs text-board-text-dim mt-2">
          Næste kort bliver {adjusted.harder ? 'sværere' : 'lettere'}: {getDifficultyLabel(adjusted.clueDifficulty).toLowerCase()} ledetråde.
        </p>
      )}
    </div>
  );
};

export default ResultBanner;
