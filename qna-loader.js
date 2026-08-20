(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setStatus(target, message) {
    target.innerHTML = '<p class="campaign-qna-status">' + escapeHtml(message) + '</p>';
  }

  async function loadCampaignQna() {
    const target = document.getElementById("campaign-qna-content");
    if (!target) return;

    const campaignTools = window.OffshoreCampaigns;
    if (!campaignTools) {
      setStatus(target, "Campaign loader was not found.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const listDescription = campaignTools.getListDescription(params);
    const campaign = campaignTools.findCampaign(listDescription) || campaignTools.getCurrentCampaign();

    if (!campaign) {
      setStatus(target, "No matching campaign Q&A was found.");
      return;
    }

    try {
      const response = await fetch("qna/" + campaign.file, { cache: "no-store" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      target.innerHTML = await response.text();
    } catch (error) {
      setStatus(target, "Unable to load Q&A for " + campaign.title + ".");
      console.error("Campaign Q&A load failed:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadCampaignQna);
  } else {
    loadCampaignQna();
  }
})();
