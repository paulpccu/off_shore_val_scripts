(function () {
  function firstValue(params, names) {
    for (const name of names) {
      const value = params.get(name);
      if (value && value.trim()) return value.trim();
    }
    return "";
  }

  function replaceTextPlaceholders(replacements) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];

    while (walker.nextNode()) {
      const parentTag = walker.currentNode.parentElement
        ? walker.currentNode.parentElement.tagName
        : "";

      if (parentTag !== "SCRIPT" && parentTag !== "STYLE") {
        textNodes.push(walker.currentNode);
      }
    }

    for (const node of textNodes) {
      let text = node.nodeValue;

      for (const replacement of replacements) {
        if (replacement.value) {
          text = text.replace(replacement.pattern, replacement.value);
        }
      }

      node.nodeValue = text;
    }
  }

  function setAll(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      if (value) element.textContent = value;
    });
  }

  function loadVicidialParameters() {
    const params = new URLSearchParams(window.location.search);
    const campaign = window.OffshoreCampaigns && window.OffshoreCampaigns.getCurrentCampaign
      ? window.OffshoreCampaigns.getCurrentCampaign()
      : null;

    const firstName = firstValue(params, ["first_name"]);
    const lastName = firstValue(params, ["last_name"]);
    const fullName = firstValue(params, ["name"]) || [firstName, lastName].filter(Boolean).join(" ");
    const listDescription = firstValue(params, [
      "list_description",
      "list_desc",
      "listdescription",
      "campaign",
      "campaign_name"
    ]) || (campaign ? campaign.title : "");
    const pledgeAmount = firstValue(params, ["amount", "province"]);
    const address = firstValue(params, ["address", "address1"]);
    const state = firstValue(params, ["state"]);
    const postalCode = firstValue(params, ["postal_code", "zip", "zip_code"]);

    replaceTextPlaceholders([
      {
        pattern: /\(\s*#?(?:list_description|list_desc|listdescription)\s*\)|\(\s*POLICE OFFICERS SUPPORT COMMITTEE PAC\s*\)|\(\s*COALITION FOR POLICE AND SHERIFFS PAC\s*\)/gi,
        value: listDescription
      },
      {
        pattern: /\(\s*#name\s*\)|\(\s*FIRST AND LAST NAME\s*\)/gi,
        value: fullName
      },
      {
        pattern: /\(\s*#(?:amount|province)\s*\)|\(\s*PROVINCE\s*\)|\(\s*donation amount\s*\)/gi,
        value: pledgeAmount
      },
      {
        pattern: /\(\s*#address\s*\)|\(\s*ADDRESS\s*\)/gi,
        value: address
      },
      {
        pattern: /\(\s*#state\s*\)|\(\s*STATE\s*\)/gi,
        value: state
      },
      {
        pattern: /\(\s*#postal_code\s*\)|\(\s*POSTAL_CODE\s*\)|\(\s*ZIP\s*\)|\(\s*ZIP CODE\s*\)/gi,
        value: postalCode
      }
    ]);

    if (campaign) {
      setAll(".campaign-website", campaign.website);
      setAll(".campaign-phone", campaign.phone);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadVicidialParameters);
  } else {
    loadVicidialParameters();
  }
})();
