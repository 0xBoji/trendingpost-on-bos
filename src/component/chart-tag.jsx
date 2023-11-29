const allPost = Social.get("*/post/main/", "final");

function findHashtags(str) {
  const regexp = /\B\#\w\w+\b/g;
  let match;
  let tags = [];
  while ((match = regexp.exec(str)) !== null) {
    tags.push(match[0]);
  }
  return tags;
}

const tagCount = {};
Object.keys(allPost).forEach((item) => {
  const tags = findHashtags(JSON.parse(allPost[item].post.main).text);
  if (tags.length > 0) {
    tags.forEach((tag) => {
      tagCount[tag] = tagCount[tag] + 1 || 1;
    });
  }
});

let entries = Object.entries(tagCount);

let sorted = entries.sort((b, a) => a[1] - b[1]);

let totalItems = 0;

// Sum the values in the sorted array
for (let i = 0; i < sorted.length; i++) {
  totalItems += sorted[i][1];
}

const labelN = "Top 20 trending tags on NEAR Social";

const backgroundcolorP = [
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
];

const borderColorP = [
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
];

const dataP = sorted.slice(0, 20).map((item) => parseInt(item[1], 10));
const labelP = sorted.slice(0, 20).map((item) => item[0]);

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  border: none;
  overflow: auto;
  @media (max-width: 968px) {
    font-size: 8px;
  }
  @media (max-width: 768px) {
    font-size: 8px;
  }
`;

const StyledTh = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #f2f2f2;
  border: none;
  text-align: center;
`;

const StyledTd = styled.td`
  padding: 12px;
  border: none;
  text-align: center;
`;

const StyledTotalContainer = styled.div`
  border: 4px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const StyledTotalLabel = styled.div`
  font-weight: bold;
  font-size: 18px;
`;

const StyledTotalValue = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin-top: 8px;
`;

const Table = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTags = sorted.filter((item) =>
    item[0].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <StyledTotalContainer>
        <StyledTotalLabel>Total Posts</StyledTotalLabel>
        <StyledTotalValue>{totalItems}</StyledTotalValue>
      </StyledTotalContainer>
      <br />
      <br />
      <br />

      <Widget
        src="marketplacebos.near/widget/TrendingPost.ChartPost"
        props={{
          dataP: dataP,
          labelP: labelP,
          backgroundcolorP: backgroundcolorP,
          borderColorP: borderColorP,
          labelN: labelN,
        }}
      />
      <br />
      <br />
      <br />
      <br />

      <input
        type="text"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <StyledTable>
        <thead>
          <tr>
            <StyledTh>TAG NAME</StyledTh>
            <StyledTh>TOTAL POST</StyledTh>
          </tr>
        </thead>
        <tbody>
          {filteredTags.map((item) => (
            <tr key={item[0]}>
              <StyledTd>
                {" "}
                <a
                  href={`https://near.social/?hashtag=${encodeURIComponent(
                    item[0].replace("#", "")
                  )}`}
                >
                  {item[0]}
                </a>
              </StyledTd>
              <StyledTd>{item[1]}</StyledTd>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </>
  );
};

return (
  <>
    <Table />
  </>
);
