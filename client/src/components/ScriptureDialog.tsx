import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Prophet Gad \u2014 Seer to King David",
    scriptures: [
      {
        ref: "1 Chronicles 21:9",
        text: "And the LORD spake unto Gad, David\u2019s seer, saying...",
      },
      {
        ref: "2 Samuel 24:11",
        text: "For when David was up in the morning, the word of the LORD came unto the prophet Gad, David\u2019s seer.",
      },
      {
        ref: "1 Samuel 22:5",
        text: "And the prophet Gad said unto David, Abide not in the hold; depart, and get thee into the land of Judah.",
      },
    ],
    summary: "Not a priest. Not a scribe. A soldier with a word.",
  },
  {
    title: "Minister of Music",
    scriptures: [
      {
        ref: "1 Chronicles 25:1",
        text: "Moreover David and the captains of the host separated to the service of the sons of Asaph, and of Heman, and of Jeduthun, who should prophesy with harps, with psalteries, and with cymbals.",
      },
    ],
    summary: "Ordered music. Disciplined sound. Appointed men, named and accountable \u2014 this was the standard of the sanctuary.",
  },
  {
    title: "From the Tribe of Warriors",
    scriptures: [
      {
        ref: "Joshua 4:12",
        text: "And the children of Reuben, and the children of Gad, and half the tribe of Manasseh, passed over armed before the children of Israel, as Moses spake unto them.",
      },
      {
        ref: "1 Chronicles 12:8",
        text: "And of the Gadites there separated themselves unto David... men of might, and men of war fit for the battle, that could handle shield and buckler, whose faces were like the faces of lions.",
      },
    ],
    summary: "They crossed first. They fought first. They praised first.",
  },
];

export function ScriptureDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="fixed bottom-4 left-4 z-40 text-amber-800"
          data-testid="button-scripture-info"
        >
          <Info className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            className="font-serif text-xl"
            style={{ color: "hsl(43, 89%, 30%)" }}
          >
            About Prophet Gad
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5 mt-2">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <h3
                className="font-serif text-base font-bold tracking-wide"
                style={{ color: "hsl(270, 40%, 40%)" }}
              >
                {section.title}
              </h3>

              {section.scriptures.map((s) => (
                <div key={s.ref} className="flex flex-col gap-0.5">
                  <span
                    className="text-sm font-bold tracking-wide"
                    style={{ color: "hsl(43, 89%, 28%)" }}
                  >
                    {s.ref}
                  </span>
                  <p
                    className="text-[15px] text-foreground leading-relaxed"
                    data-testid={`text-scripture-${s.ref.replace(/\s/g, "-")}`}
                  >
                    {s.text}
                  </p>
                </div>
              ))}

              <p
                className="text-[15px] italic leading-relaxed mt-1"
                style={{ color: "hsl(30, 20%, 35%)" }}
              >
                {section.summary}
              </p>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-600/20 to-transparent mt-1" />
            </div>
          ))}

          <p
            className="text-[15px] font-serif italic text-center leading-relaxed"
            style={{ color: "hsl(270, 30%, 40%)" }}
            data-testid="text-scripture-closing"
          >
            Historical office. Disciplined sound. Clear signal.
            <br />
            The full teaching is given in Prophet Gad\u2019s published volumes \u2014 the analysis here applies the same criteria to every nation.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
