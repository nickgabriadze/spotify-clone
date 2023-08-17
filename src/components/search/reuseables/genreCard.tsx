
export function GenreCard({
  genre,
  colorHex,
}: {
  genre: string;
  colorHex: string;
}) {
  return (
    <div
      style={{
        cursor: "pointer",
        backgroundColor: colorHex,
        height: "200px",
        color: "white",
        padding: "10px",
        borderRadius: "10px",
        fontSize: "1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h1>
        {genre
          .split("-")
          .map((letter) => letter[0].toUpperCase().concat(letter.slice(1)))
          .join(" ")}
      </h1>
    </div>
  );
}

export default GenreCard;
