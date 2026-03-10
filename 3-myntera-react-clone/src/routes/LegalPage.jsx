import { useParams } from "react-router-dom";

const LegalPage = () => {
  const { pageName } = useParams();
  
  // URL slug ko sundar naam mein badalne ke liye (e.g. 'contact-us' -> 'Contact Us')
  const formattedName = pageName.replace(/-/g, ' ').toUpperCase();

  return (
    <div style={{ padding: "100px 5%", textAlign: "center", minHeight: "60vh" }}>
      <h2 style={{ color: "#ff3f6c" }}>{formattedName}</h2>
      <p style={{ marginTop: "20px", color: "#696b79" }}>
        This is a placeholder for the <strong>{formattedName}</strong> page of the Myntra Clone.
        <br />Coming soon with full details!
      </p>
    </div>
  );
};

export default LegalPage;