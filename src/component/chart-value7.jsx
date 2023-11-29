const findHashtags = (str) => {
    const regexp = /\B\#\w\w+\b/g;
    let match;
    let tags = [];
    while ((match = regexp.exec(str)) !== null) {
      tags.push(match[0]);
    }
    return tags;
  };
  const respBlock = fetch("https://api.nearblocks.io/v1/stats");
  
  const newBlock = Math.round(
    parseInt(respBlock.body.stats[0].block) -
      (30 * 24 * 3600) / parseInt(respBlock.body.stats[0].avg_block_time)
  );
  const newBlock1Days = Math.round(
    parseInt(respBlock.body.stats[0].block) -
      (1 * 24 * 3600) / parseInt(respBlock.body.stats[0].avg_block_time)
  );
  const newBlock3Days = Math.round(
    parseInt(respBlock.body.stats[0].block) -
      (3 * 24 * 3600) / parseInt(respBlock.body.stats[0].avg_block_time)
  );
  const newBlock7Days = Math.round(
    parseInt(respBlock.body.stats[0].block) -
      (7 * 24 * 3600) / parseInt(respBlock.body.stats[0].avg_block_time)
  );
  const allPost = Social.get("*/post/main/", "final");
  
  const tagCountAll = {};
  const tagCount1Days = {};
  const tagCount3Days = {};
  const tagCount7Days = {};
  Object.keys(allPost).forEach((item) => {
    const tags = findHashtags(JSON.parse(allPost[item].post.main).text);
    if (tags.length > 0) {
      tags.forEach((tag) => {
        tagCountAll[tag] = 0;
        tagCount1Days[tag] = 0;
        tagCount3Days[tag] = 0;
        tagCount7Days[tag] = 0;
      });
    }
  });
  Object.keys(tagCountAll).forEach((tag) => {
    const countAllPost = Social.index("hashtag", tag.replace("#", ""), {
      from: newBlock,
      limit: 999,
      order: "asc",
    });
    const count1DaysPost = Social.index("hashtag", tag.replace("#", ""), {
      from: newBlock1Days,
      limit: 999,
      order: "asc",
    });
    const count3DaysPost = Social.index("hashtag", tag.replace("#", ""), {
      from: newBlock3Days,
      limit: 999,
      order: "asc",
    });
    const count7DaysPost = Social.index("hashtag", tag.replace("#", ""), {
      from: newBlock7Days,
      limit: 999,
      order: "asc",
    });
    tagCountAll[tag] = countAllPost.length || 0;
    tagCount1Days[tag] = count1DaysPost.length || 0;
    tagCount3Days[tag] = count3DaysPost.length || 0;
    tagCount7Days[tag] = count7DaysPost.length || 0;
  });
  
  let entriesALL = Object.entries(tagCountAll);
  let allPostSorted = entriesALL.sort((b, a) => a[1] - b[1]);
  
  let entries1 = Object.entries(tagCount1Days);
  let day1PostSorted = entries1.sort((b, a) => a[1] - b[1]);
  
  let entries3 = Object.entries(tagCount3Days);
  let day3PostSorted = entries3.sort((b, a) => a[1] - b[1]);
  
  let entries7 = Object.entries(tagCount7Days);
  let day7PostSorted = entries7.sort((b, a) => a[1] - b[1]);
  
  let totalItems7Days = 0;
  
  // Sum the values in the day7PostSorted array
  for (let i = 0; i < day7PostSorted.length; i++) {
    totalItems7Days += day7PostSorted[i][1];
  }
  
  const labelN = "Top 20 trending tags on NEAR Social in 7 days";
  
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
  
  let dataP = [];
  let labelP = [];
  
  // Assuming allPostSorted has at least 20 items
  for (let i = 0; i < 20; i++) {
    if (day7PostSorted[i]) {
      dataP.push(day7PostSorted[i][1]); // Assuming item[1] contains the data for dataP
      labelP.push(day7PostSorted[i][0]); // Assuming item[0] contains the data for labelP
    }
  }
  
  // ... (rest of the code remains unchanged)
  
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
  
    return (
      <>
        <StyledTotalContainer>
          <StyledTotalLabel>Total Posts</StyledTotalLabel>
          <StyledTotalValue>{totalItems7Days}</StyledTotalValue>
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
            {day7PostSorted &&
              day7PostSorted
                .filter((item, index) => index <= 20)
                .map((item) => (
                  <tr>
                    <StyledTd>
                      <a
                        href={`https://near.social/marketplacebos.near/widget/TrendingPost.TableValue?hashtag=${item[0].replace(
                          "#",
                          ""
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
  