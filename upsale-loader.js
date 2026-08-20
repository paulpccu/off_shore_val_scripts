(function () {
  function firstValue(params, names) {
    for (const name of names) {
      const value = params.get(name);
      if (value && value.trim()) return value.trim();
    }
    return "";
  }

  function getPledgeAmount(params) {
    const rawAmount = firstValue(params, ["amount", "province"]);
    const cleanedAmount = rawAmount.replace(/[^0-9.]/g, "");
    return parseFloat(cleanedAmount) || 0;
  }

  function formatDollarAmount(amount) {
    return "$" + amount.toLocaleString("en-US", {
      maximumFractionDigits: 0
    });
  }

  function getUpsaleText(amount) {
    if (amount <= 0) {
      return "No pledge amount was found for the upsale script.";
    }

    if (amount <= 35) {
      return "And Ma'am/Sir, I see you are generously contributing to our patron booster of " +
        formatDollarAmount(amount) +
        ". This year we are asking residents that have the ability if they can comfortably add $2 or $5 dollars to their pledge to defray the cost of the calls and mailings. Bringing your total to an even " +
        formatDollarAmount(amount + 2) +
        " or " +
        formatDollarAmount(amount + 5) +
        ". Can the association count on you for one of those pledges just one time for the drive?";
    }

    if (amount <= 70) {
      return "And Ma'am/Sir, I see you are generously contributing our patron level booster of " +
        formatDollarAmount(amount) +
        ". This year we are asking residents that have the ability if they can comfortably add $5 or $10 dollars to their pledge to defray the cost of the calls and mailings. Bringing your total to an even " +
        formatDollarAmount(amount + 5) +
        " or " +
        formatDollarAmount(amount + 10) +
        ". Can the association count on you for one of those pledges just one time for the drive?";
    }

    if (amount <= 95) {
      return "And Ma'am/Sir, I see you are generously contributing our silver level booster of " +
        formatDollarAmount(amount) +
        ". This year we are asking residents that have the ability if they can comfortably add $15 or $20 dollars to their pledge to defray the cost of the calls and mailings. Bringing your total to an even " +
        formatDollarAmount(amount + 15) +
        " or " +
        formatDollarAmount(amount + 20) +
        ". Can the officers count on you for one of those pledges just one time for the drive?";
    }

    return "I see you are generously contributing our gold level booster of " +
      formatDollarAmount(amount) +
      ". We are asking all residents such as yourself, if they have the ability to of course, to reach up and do one of the special sponsorships this year. There is a very popular dollar a day booster for $365 as well as the diamond at $200. Can you be a hero for the officers and increase your pledge to one of these just one time for the drive?";
  }

  function loadUpsale() {
    const upsaleElement = document.getElementById("upsale-text");
    if (!upsaleElement) return;

    const params = new URLSearchParams(window.location.search);
    upsaleElement.textContent = getUpsaleText(getPledgeAmount(params));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadUpsale);
  } else {
    loadUpsale();
  }
})();
