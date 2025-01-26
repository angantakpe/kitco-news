import pressReleases from "../../press_releases.json";
// import { useEffect, useState } from "react";

export async function getStaticProps() {
  return {
    props: {
      pressReleases,
    },
  };
}

const PressReleases = ({ pressReleases }) => {
  return (
    <div>
      <h1>Press Releases</h1>
      {Object.entries(pressReleases).map(([category, releases]) => (
        <div key={category}>
          <h2>{category}</h2>
          {(releases as any[]).map((release, index) => (
            <div key={index}>
              <h3>{release.title}</h3>
              <p>{release.content}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// const PressReleases = () => {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     fetch("/api/press-releases")
//       .then((response) => response.json())
//       .then((data) => setData(data));
//   }, []);

//   if (!data) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>Press Releases</h1>
//       {Object.entries(data).map(([category, releases]) => (
//         <div key={category}>
//           <h2>{category}</h2>
//           {(releases as any[]).map((release, index) => (
//             <div key={index}>
//               <h3>{release.title}</h3>
//               <p>{release.content}</p>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

export default PressReleases;
