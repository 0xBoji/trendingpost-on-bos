const respBlock = fetch("https://api.nearblocks.io/v1/stats");

const newBlock = Math.round(
  parseInt(respBlock.body.stats[0].block) -
    (30 * 24 * 3600) / parseInt(respBlock.body.stats[0].avg_block_time)
);
const newBlock3Days = Math.round(
  parseInt(respBlock.body.stats[0].block) -
    (3 * 24 * 3600) / parseInt(respBlock.body.stats[0].avg_block_time)
);
const newBlock7Days = Math.round(
  parseInt(respBlock.body.stats[0].block) -
    (7 * 24 * 3600) / parseInt(respBlock.body.stats[0].avg_block_time)
);
const allPost = Social.index("hashtag", props.hashtag || "near", {
  from: newBlock,
  limit: 300,
  order: "asc",
});

let postEngagement = [];

if (allPost.length > 0) {
  allPost.forEach((item) => {
    const allComment = Social.index(
      "comment",
      {
        type: "social",
        path: `${item.accountId}/post/main`,
        blockHeight: item.blockHeight,
      },
      {
        limit: 9999,
        order: "desc",
      }
    );
    const allLike = Social.index("like", {
      type: "social",
      path: `${item.accountId}/post/main`,
      blockHeight: item.blockHeight,
    });
    const allRepost = Social.index(
      "repost",
      {
        type: "social",
        path: `${item.accountId}/post/main`,
        blockHeight: item.blockHeight,
      },
      {
        limit: 9999,
        order: "desc",
      }
    );

    const allComment3Days = Social.index(
      "comment",
      {
        type: "social",
        path: `${item.accountId}/post/main`,
        blockHeight: item.blockHeight,
      },
      {
        from: newBlock3Days,
        limit: 9999,
        order: "asc",
      }
    );
    const allLike3Days = Social.index(
      "like",
      {
        type: "social",
        path: `${item.accountId}/post/main`,
        blockHeight: item.blockHeight,
      },
      {
        from: newBlock3Days,
        limit: 9999,
        order: "asc",
      }
    );
    const allRepost3Days = Social.index(
      "repost",
      {
        type: "social",
        path: `${item.accountId}/post/main`,
        blockHeight: item.blockHeight,
      },
      { from: newBlock3Days, limit: 9999, order: "asc" }
    );

    const allComment7Days = Social.index(
      "comment",
      {
        type: "social",
        path: `${item.accountId}/post/main`,
        blockHeight: item.blockHeight,
      },
      {
        from: newBlock7Days,
        limit: 9999,
        order: "asc",
      }
    );
    const allLike7Days = Social.index(
      "like",
      {
        type: "social",
        path: `${item.accountId}/post/main`,
        blockHeight: item.blockHeight,
      },
      {
        from: newBlock7Days,
        limit: 9999,
        order: "asc",
      }
    );
    const allRepost7Days = Social.index(
      "repost",
      {
        type: "social",
        path: `${item.accountId}/post/main`,
        blockHeight: item.blockHeight,
      },
      { from: newBlock7Days, limit: 9999, order: "asc" }
    );

    const res = fetch(
      `https://api.near.social/time?blockHeight=${item.blockHeight}`
    );
    const dateCreated = res.body;

    if (allComment.length + allLike.length + allRepost.length > 0) {
      postEngagement.push({
        accountId: item.accountId,
        blockHeight: item.blockHeight,
        allLike: allLike.length,
        allComment: allComment.length,
        allRepost: allRepost.length,
        EP:
          (allComment.length * 3 + allLike.length + allRepost.length * 2) /
            Math.floor(
              (Date.now() - new Date(dateCreated)) / 1000 / (3600 * 24)
            ) || 0,
        EP3D:
          (allComment3Days.length * 3 +
            allLike3Days.length +
            allRepost3Days.length * 2) /
            3 || 0,
        EP7D:
          (allComment7Days.length * 3 +
            allLike7Days.length +
            allRepost7Days.length * 2) /
            7 || 0,
        dateCreated: dateCreated,
      });
    }
  });
}

const compare = (b, a) => {
  if (a.EP < b.EP) {
    return -1;
  }
  if (a.EP > b.EP) {
    return 1;
  }
  return 0;
};
const sort = postEngagement.sort(compare);

let totalItems = 0;
let totalAccountPosts = 0;
let totalLikes = 0;
let totalComments = 0;
let totalReposts = 0;

// Iterate over postEngagement array to count totals
postEngagement.forEach((item) => {
  totalItems += 1; // Assuming each item represents a post
  totalAccountPosts += 1; // Assuming each item represents an account post
  totalLikes += item.allLike || 0;
  totalComments += item.allComment || 0;
  totalReposts += item.allRepost || 0;
});

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  border: none;
      font-size: 10px;

  @media (max-width: 1268px) {
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

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  border: 4px solid black;
   border-right: 2px solid black;
  padding-right: 10px; 
  &:last-child {
    border-right: none; 
  }
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
  }
`;

const StyledTotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    margin: 0 10px; /* Add some spacing between the two containers on wider screens */
  }
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

const Wap = styled.div`
  padding: 30px;
  align-items: center;
  text-align: center;
`;

const labelN = "Top trending posts in 3days on NEAR Social";

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

// Check if item.accountId is defined and not null
postEngagement.forEach((item) => {
  if (item.accountId) {
    dataP.push(item.EP7D || 0); // Assuming EP is the ENCOURAGE POINT
    labelP.push(
      new Date(item.dateCreated).toLocaleString("en-GB", {
        hour12: false,
      }) || ""
    ); // Assuming dateCreated is the date
  }
});
// Check if item.accountId is defined and not null

const Table = () => {
  return (
    <>
      <Wap>
        <StyledContainer>
          <StyledTotalContainer>
            <StyledTotalLabel>Total Posts</StyledTotalLabel>
            <StyledTotalValue>{totalItems}</StyledTotalValue>
          </StyledTotalContainer>
          <StyledTotalContainer>
            <StyledTotalLabel>Total Account Posts</StyledTotalLabel>
            <StyledTotalValue>{totalAccountPosts}</StyledTotalValue>
          </StyledTotalContainer>
          <StyledTotalContainer>
            <StyledTotalLabel>Total Likes</StyledTotalLabel>
            <StyledTotalValue>{totalLikes}</StyledTotalValue>
          </StyledTotalContainer>
          <StyledTotalContainer>
            <StyledTotalLabel>Total Comments</StyledTotalLabel>
            <StyledTotalValue>{totalComments}</StyledTotalValue>
          </StyledTotalContainer>
          <StyledTotalContainer>
            <StyledTotalLabel>Total Reposts</StyledTotalLabel>
            <StyledTotalValue>{totalReposts}</StyledTotalValue>
          </StyledTotalContainer>
        </StyledContainer>
        <br />
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
        <div>
          Trending Tag:{" "}
          <a href={`https://near.social/?hashtag=${props.hashtag || "near"}`}>
            {props.hashtag || "near"}
          </a>
        </div>
        <br />
        <br />
        <br />
        <StyledTable>
          <thead>
            <tr>
              <StyledTh>POST ID</StyledTh>
              <StyledTh>ACCOUNT_ID</StyledTh>
              <StyledTh>ENCOURAGE POINT</StyledTh>
              <StyledTh>ENCOURAGE POINT_3Days</StyledTh>
              <StyledTh>ENCOURAGE POINT_7Days</StyledTh>
              <StyledTh>TOTAL LIKES</StyledTh>
              <StyledTh>TOTAL COMMENTS</StyledTh>
              <StyledTh>TOTAL REPOSTS</StyledTh>
              <StyledTh>CREATED</StyledTh>
            </tr>
          </thead>
          <tbody>
            {sort.map((item) => (
              <tr>
                <StyledTd scope="row">
                  <a
                    href={`https://near.social/mob.near/widget/MainPage.N.Post.Page?accountId=${item.accountId}&blockHeight=${item.blockHeight}`}
                  >
                    {item.blockHeight}
                  </a>
                </StyledTd>
                <StyledTd maxWidth="100px">
                  <a
                    href={`https://near.social/mob.near/widget/ProfilePage?accountId=${
                      typeof item.accountId === "string" &&
                      item.accountId.includes(".near")
                        ? item.accountId
                        : typeof item.accountId === "string" &&
                          item.accountId.slice(0, 7) +
                            "..." +
                            item.accountId.slice(
                              item.accountId.length - 10,
                              item.accountId.length - 1
                            )
                    }`}
                  >
                    {typeof item.accountId === "string" &&
                    item.accountId.includes(".near")
                      ? item.accountId
                      : typeof item.accountId === "string" &&
                        item.accountId.slice(0, 7) +
                          "..." +
                          item.accountId.slice(
                            item.accountId.length - 10,
                            item.accountId.length - 1
                          )}
                  </a>
                </StyledTd>
                <StyledTd>{item.EP && item.EP.toFixed(4)}</StyledTd>
                <StyledTd>{item.EP3D && item.EP3D.toFixed(4)}</StyledTd>
                <StyledTd>{item.EP7D && item.EP7D.toFixed(4)}</StyledTd>
                <StyledTd>{item.allLike}</StyledTd>
                <StyledTd>{item.allComment}</StyledTd>
                <StyledTd>{item.allRepost}</StyledTd>
                <StyledTd>
                  {new Date(item.dateCreated).toLocaleString("en-GB", {
                    hour12: false,
                  })}
                </StyledTd>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </Wap>
    </>
  );
};updateupdateupdate
updateupdateupdateupdate
updateupdateupdateupdateupdate
return (
  <>
    <Table />
  </>
);
