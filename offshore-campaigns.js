(function () {
  const campaigns = [
    {
      id: "acps",
      title: "COALITION FOR POLICE AND SHERIFFS PAC",
      file: "acpsqna.html",
      website: "www.americanpolice.org",
      phone: "866-439-6185",
      aliases: [
        "AMERICAN COALITION OF POLICE AND SHERIFFS PAC",
        "COALITION OF POLICE AND SHERIFFS PAC",
        "ACPS",
        "ACPS PAC"
      ]
    },
    {
      id: "posc",
      title: "POLICE OFFICERS SUPPORT COMMITTEE PAC",
      file: "poscqna.html",
      website: "www.policecommittee.org",
      phone: "866-439-6480",
      aliases: [
        "POSC",
        "POSC PAC"
      ]
    }
  ];

  function normalize(value) {
    return String(value || "")
      .toUpperCase()
      .replace(/&AMP;/g, "AND")
      .replace(/&/g, "AND")
      .replace(/[^A-Z0-9]/g, "");
  }

  const index = campaigns.map((campaign) => ({
    ...campaign,
    normalizedTitle: normalize(campaign.title),
    relaxedTitle: normalize(campaign.title.replace(/^THE\s+/i, "").replace(/\s+PAC$/i, "")),
    normalizedAliases: campaign.aliases.map(normalize)
  }));

  function findCampaign(listDescription) {
    const key = normalize(listDescription);
    if (!key) return null;

    const exact = index.find((campaign) =>
      campaign.normalizedTitle === key ||
      campaign.relaxedTitle === key ||
      campaign.normalizedAliases.includes(key)
    );
    if (exact) return exact;

    return index
      .filter((campaign) =>
        key.includes(campaign.normalizedTitle) ||
        campaign.normalizedTitle.includes(key) ||
        key.includes(campaign.relaxedTitle) ||
        campaign.relaxedTitle.includes(key) ||
        campaign.normalizedAliases.some((alias) => key.includes(alias) || alias.includes(key))
      )
      .sort((a, b) => b.normalizedTitle.length - a.normalizedTitle.length)[0] || null;
  }

  function getListDescription(params) {
    const names = [
      "list_description",
      "list_desc",
      "listdescription",
      "campaign",
      "campaign_name"
    ];

    for (const name of names) {
      const value = params.get(name);
      if (value && value.trim()) return value.trim();
    }

    return "";
  }

  function getCurrentCampaign() {
    const params = new URLSearchParams(window.location.search);
    const listDescription = getListDescription(params);
    return findCampaign(listDescription) || index.find((campaign) => campaign.id === "posc");
  }

  window.OffshoreCampaigns = {
    campaigns,
    findCampaign,
    getCurrentCampaign,
    getListDescription,
    normalize
  };
})();
