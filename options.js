function clearData()
{
  console.log("data cleared!")
  browser.storage.sync.set({data: []});
}

document.querySelector("button").addEventListener("click", clearData);
