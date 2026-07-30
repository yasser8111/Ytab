chrome.commands.onCommand.addListener(async (command) => {
  if (command === "save-all-tabs") {
    await handleSaveTabs("all");
  } else if (command === "save-single-tab") {
    await handleSaveTabs("single");
  }
});

async function handleSaveTabs(mode) {
  try {
    const tabs = await chrome.tabs.query({ currentWindow: true });

    let yTab = tabs.find((t) => t.url && t.url.includes(chrome.runtime.id));

    let targetTabs = [];
    let groupTitle = "";

    if (mode === "all") {
      targetTabs = tabs.filter((t) => t.id !== (yTab ? yTab.id : -1));
      groupTitle = "Saved All Tabs";
    } else if (mode === "single") {
      const activeIndex = tabs.findIndex((t) => t.active);
      let targetTab = null;

      if (tabs[activeIndex].id === (yTab ? yTab.id : -1)) {
        if (activeIndex > 0) {
          targetTab = tabs[activeIndex - 1];
        } else if (tabs.length > 1) {
          targetTab = tabs[1];
        }
      } else {
        targetTab = tabs[activeIndex];
      }

      if (targetTab) {
        targetTabs = [targetTab];
      }
      groupTitle = "Saved Tab";
    }

    if (targetTabs.length === 0) return;

    const sites = targetTabs.map((t) => {
      let hostname = "";
      try {
        hostname = new URL(t.url).hostname;
      } catch (err) {}
      return {
        id: Date.now() + Math.random(),
        title: t.title || "Untitled Tab",
        description: "",
        url: t.url,
        icon:
          t.favIconUrl ||
          (hostname
            ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
            : ""),
      };
    });

    const newGroup = {
      title: groupTitle,
      sites: sites,
      timestamp: Date.now(),
    };

    const { pendingGroups = [] } =
      await chrome.storage.local.get("pendingGroups");
    await chrome.storage.local.set({
      pendingGroups: [...pendingGroups, newGroup],
    });

    if (yTab) {
      await chrome.tabs.update(yTab.id, { active: true });
      setTimeout(() => {
        chrome.runtime.sendMessage({ type: "NEW_TABS_SAVED" }).catch(() => {});
      }, 300);
    } else {
      await chrome.tabs.create({ url: "index.html" });
    }
  } catch (error) {
    console.error("Error saving tabs:", error);
  }
}
