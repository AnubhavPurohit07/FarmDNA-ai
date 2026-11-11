
import { useEffect, useState } from "react";
import {
  getAgricultureHistory,
  getAgricultureStatus,
  predictCrop,
  getFertilizerAdvice,
  getIrrigationPlan,
} from "../api/agriculture";
import { Button, Input, Loader, showToast } from "../components/ui";

const TABS = [
  { id: "crop", label: "Crop recommendation", description: "Machine learning" },
  { id: "fertilizer", label: "Fertilizer advisor", description: "Soil nutrient analysis" },
  { id: "irrigation", label: "Irrigation planner", description: "Water estimation" },
];

const CROPS = [
  "rice", "maize", "chickpea", "kidneybeans",
  "pigeonpeas", "mothbeans", "mungbean", "blackgram",
  "lentil", "pomegranate", "banana", "mango",
  "grapes", "watermelon", "muskmelon", "apple",
  "orange", "papaya", "coconut", "cotton",
  "jute", "coffee",
];

const initialCrop = {
  nitrogen: 90,
  phosphorus: 42,
  potassium: 43,
  temperature: 25,
  humidity: 80,
  ph: 6.5,
  rainfall: 200,
};

const initialFertilizer = {
  crop: "wheat",
  nitrogen: 70,
  phosphorus: 35,
  potassium: 25,
  area_ha: 1,
};

const initialIrrigation = {
  crop: "wheat",
  area_ha: 1,
  eto_mm_day: 4.5,
  rainfall_mm: 1,
  soil_moisture_pct: 35,
  growth_stage: "development",
  efficiency_pct: 75,
};

const inputClass =
  "w-full rounded-md border border-(--color-line) bg-(--color-surface) px-3 py-2.5 text-sm text-(--color-ink) focus:outline-none focus:ring-2 focus:ring-(--color-accent)";

function NumberField({
  label,
  name,
  value,
  onChange,
  min = 0,
  max,
  step = "any",
  suffix,
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-(--color-ink)">
        {label}{suffix ? ` (${suffix})` : ""}
      </span>
      <input
        className={inputClass}
        type="number"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        required
      />
    </label>
  );
}

function CropField({ value, onChange }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-(--color-ink)">Crop</span>
      <select className={inputClass} value={value} onChange={onChange}>
        {[
          "rice",
          "wheat",
          "maize",
          "cotton",
          "sugarcane",
          "tomato",
          "potato",
          "banana",
          "soybean",
          "mustard",
        ].map((crop) => (
          <option key={crop} value={crop}>
            {crop[0].toUpperCase() + crop.slice(1)}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultPanel({ result, type, expectedCrop }) {
  if (!result) return null;

  const recommendations = result.recommendations || [];

  const expectedMatch =
    type === "crop" && expectedCrop
      ? recommendations.find(
          (item) =>
            item.crop.toLowerCase() === expectedCrop.toLowerCase()
        )
      : null;

  const expectedRank = expectedMatch
    ? recommendations.indexOf(expectedMatch) + 1
    : null;

  return (
    <div className="mt-7 rounded-xl border border-(--color-accent)/30 bg-(--color-accent)/5 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl font-medium text-(--color-ink)">
          Your analysis
        </h3>
        <span className="text-xs rounded-full px-2.5 py-1 bg-(--color-accent)/10 text-(--color-accent)">
          Saved to history
        </span>
      </div>

      {type === "crop" && (
        <>
          <p className="text-sm text-(--color-muted)">
            Top crop matches from the trained Random Forest model
            (model scores, not calibrated probabilities):
          </p>

          <div className="space-y-3">
            {recommendations.map((item, index) => (
              <div key={item.crop} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-(--color-accent)/10 flex items-center justify-center text-sm font-semibold text-(--color-accent)">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <strong>{item.crop}</strong>
                    <span>{item.model_score}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-(--color-line) overflow-hidden">
                    <div
                      className="h-full rounded-full bg-(--color-accent)"
                      style={{ width: `${item.model_score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {expectedCrop && (
            <div className="rounded-lg border border-(--color-line) bg-(--color-surface) p-4 space-y-3">
              <h4 className="font-semibold text-sm text-(--color-ink)">
                Expected Crop Comparison
              </h4>

              <div className="flex justify-between text-sm gap-3">
                <span className="text-(--color-muted)">
                  Expected crop
                </span>
                <strong className="capitalize">{expectedCrop}</strong>
              </div>

              {expectedMatch ? (
                <div className="rounded-lg bg-green-500/10 p-3">
                  <p className="text-sm font-medium text-green-700">
                    Expected crop found in the top 3 recommendations!
                  </p>
                  <p className="text-xs text-(--color-muted) mt-1">
                    Rank: #{expectedRank} · Model score: {expectedMatch.model_score}%
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-amber-500/10 p-3">
                  <p className="text-sm font-medium text-amber-700">
                    Expected crop was not found in the top 3 recommendations.
                  </p>
                  <p className="text-xs text-(--color-muted) mt-1">
                    Try comparing with another test record from your dataset.
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-(--color-muted)">
            {result.disclaimer}
          </p>
        </>
      )}

      {type === "fertilizer" && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(result.nutrients).map(([key, item]) => (
              <div
                key={key}
                className="rounded-lg bg-(--color-surface) p-3"
              >
                <p className="text-xs text-(--color-muted)">{key}</p>
                <p className="text-lg font-semibold text-(--color-ink)">
                  {item.status}
                </p>
                <p className="text-xs text-(--color-muted)">
                  {item.measured} / {item.reference}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {result.recommendations.map((line) => (
              <p key={line} className="text-sm text-(--color-ink)">
                • {line}
              </p>
            ))}
          </div>

          <p className="text-xs text-(--color-muted)">{result.note}</p>
        </>
      )}

      {type === "irrigation" && (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-(--color-surface) p-4">
              <p className="text-xs text-(--color-muted)">
                Estimated water
              </p>
              <p className="font-display text-2xl text-(--color-ink)">
                {result.estimated_water_litres.toLocaleString()} L
              </p>
              <p className="text-xs text-(--color-muted)">
                {result.estimated_water_m3} m³ for this estimate
              </p>
            </div>

            <div className="rounded-lg bg-(--color-surface) p-4">
              <p className="text-xs text-(--color-muted)">
                Gross irrigation depth
              </p>
              <p className="font-display text-2xl text-(--color-ink)">
                {result.gross_irrigation_depth_mm} mm
              </p>
              <p className="text-xs text-(--color-muted)">
                Net depth: {result.net_irrigation_depth_mm} mm
              </p>
            </div>
          </div>

          <p className="text-sm text-(--color-ink)">{result.message}</p>
          <p className="text-xs text-(--color-muted)">{result.note}</p>
        </>
      )}
    </div>
  );
}

export default function Agriculture() {
  const [tab, setTab] = useState("crop");
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const [crop, setCrop] = useState(initialCrop);
  const [expectedCrop, setExpectedCrop] = useState("");

  const [fertilizer, setFertilizer] = useState(initialFertilizer);
  const [irrigation, setIrrigation] = useState(initialIrrigation);

  useEffect(() => {
    Promise.all([getAgricultureStatus(), getAgricultureHistory()])
      .then(([health, records]) => {
        setStatus(health);
        setHistory(records);
      })
      .catch((error) => showToast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  function update(setter) {
    return (event) => {
      const { name, value } = event.target;

      setter((previous) => ({
        ...previous,
        [name]:
          event.target.type === "number" ? Number(value) : value,
      }));
    };
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setResult(null);

    try {
      const output =
        tab === "crop"
          ? await predictCrop(crop)
          : tab === "fertilizer"
            ? await getFertilizerAdvice(fertilizer)
            : await getIrrigationPlan(irrigation);

      setResult(output);
      setHistory(await getAgricultureHistory());
      showToast.success("Analysis completed and saved.");
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <div className="max-w-3xl mb-8">
        <p className="font-mono text-xs tracking-widest text-(--color-accent) mb-2">
          FARMER DECISION SUPPORT
        </p>

        <h1 className="font-display text-3xl sm:text-4xl font-medium text-(--color-ink)">
          Agricultural Intelligence
        </h1>

        <p className="mt-3 text-sm leading-6 text-(--color-muted)">
          Enter field conditions to get crop suitability, nutrient screening
          and irrigation planning estimates. Each completed analysis is stored
          in your FarmDNA history.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setResult(null);
            }}
            className={`text-left rounded-xl border p-4 transition-colors ${
              tab === item.id
                ? "border-(--color-accent) bg-(--color-accent)/5"
                : "border-(--color-line) bg-(--color-surface) hover:border-(--color-accent)/50"
            }`}
          >
            <span className="block text-sm font-semibold text-(--color-ink)">
              {item.label}
            </span>
            <span className="block text-xs text-(--color-muted) mt-1">
              {item.description}
            </span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)] gap-6 items-start">
        <div className="rounded-xl border border-(--color-line) bg-(--color-surface) p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="font-display text-xl font-medium text-(--color-ink)">
              {TABS.find((item) => item.id === tab).label}
            </h2>
            <p className="text-xs text-(--color-muted) mt-1">
              All fields are required for this calculation, except the expected crop testing field.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {tab === "crop" && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <NumberField
                    label="Nitrogen"
                    name="nitrogen"
                    value={crop.nitrogen}
                    max={300}
                    onChange={update(setCrop)}
                  />

                  <NumberField
                    label="Phosphorus"
                    name="phosphorus"
                    value={crop.phosphorus}
                    max={300}
                    onChange={update(setCrop)}
                  />

                  <NumberField
                    label="Potassium"
                    name="potassium"
                    value={crop.potassium}
                    max={400}
                    onChange={update(setCrop)}
                  />

                  <NumberField
                    label="Temperature"
                    suffix="°C"
                    name="temperature"
                    value={crop.temperature}
                    min={-5}
                    max={60}
                    onChange={update(setCrop)}
                  />

                  <NumberField
                    label="Humidity"
                    suffix="%"
                    name="humidity"
                    value={crop.humidity}
                    max={100}
                    onChange={update(setCrop)}
                  />

                  <NumberField
                    label="Soil pH"
                    name="ph"
                    value={crop.ph}
                    max={14}
                    step="0.1"
                    onChange={update(setCrop)}
                  />

                  <NumberField
                    label="Rainfall"
                    suffix="mm"
                    name="rainfall"
                    value={crop.rainfall}
                    max={2000}
                    onChange={update(setCrop)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-(--color-ink)">
                    Expected Crop (For Testing)
                  </label>

                  <select
                    className={inputClass}
                    value={expectedCrop}
                    onChange={(event) => setExpectedCrop(event.target.value)}
                  >
                    <option value="">Select expected crop (Optional)</option>

                    {CROPS.map((item) => (
                      <option key={item} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </option>
                    ))}
                  </select>

                  <p className="text-xs text-(--color-muted)">
                    Select the known crop from your dataset to compare it
                    with the model's top 3 recommendations. This value is
                    only for testing and is not sent to the ML model.
                  </p>
                </div>

                <div className="rounded-lg bg-(--color-canvas) p-3 text-xs text-(--color-muted)">
                  Model input uses the seven fields from the Crop
                  Recommendation Dataset: N, P, K, temperature, humidity,
                  pH and rainfall.
                </div>
              </>
            )}

            {tab === "fertilizer" && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <CropField
                    value={fertilizer.crop}
                    onChange={(event) =>
                      setFertilizer((previous) => ({
                        ...previous,
                        crop: event.target.value,
                      }))
                    }
                  />

                  <NumberField
                    label="Field area"
                    suffix="hectares"
                    name="area_ha"
                    value={fertilizer.area_ha}
                    min={0.01}
                    onChange={update(setFertilizer)}
                  />

                  <NumberField
                    label="Soil nitrogen"
                    suffix="kg/ha (reported)"
                    name="nitrogen"
                    value={fertilizer.nitrogen}
                    max={1000}
                    onChange={update(setFertilizer)}
                  />

                  <NumberField
                    label="Soil phosphorus"
                    suffix="kg/ha (reported)"
                    name="phosphorus"
                    value={fertilizer.phosphorus}
                    max={1000}
                    onChange={update(setFertilizer)}
                  />

                  <NumberField
                    label="Soil potassium"
                    suffix="kg/ha (reported)"
                    name="potassium"
                    value={fertilizer.potassium}
                    max={1000}
                    onChange={update(setFertilizer)}
                  />
                </div>

                <p className="text-xs text-(--color-muted)">
                  Use comparable soil-test values only. Soil test reports
                  may use different extraction methods and units.
                </p>
              </>
            )}

            {tab === "irrigation" && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <CropField
                    value={irrigation.crop}
                    onChange={(event) =>
                      setIrrigation((previous) => ({
                        ...previous,
                        crop: event.target.value,
                      }))
                    }
                  />

                  <NumberField
                    label="Field area"
                    suffix="hectares"
                    name="area_ha"
                    value={irrigation.area_ha}
                    min={0.01}
                    onChange={update(setIrrigation)}
                  />

                  <NumberField
                    label="Reference ET₀"
                    suffix="mm/day"
                    name="eto_mm_day"
                    value={irrigation.eto_mm_day}
                    min={0.1}
                    max={20}
                    step="0.1"
                    onChange={update(setIrrigation)}
                  />

                  <NumberField
                    label="Recent rainfall"
                    suffix="mm/day"
                    name="rainfall_mm"
                    value={irrigation.rainfall_mm}
                    max={300}
                    step="0.1"
                    onChange={update(setIrrigation)}
                  />

                  <NumberField
                    label="Soil moisture"
                    suffix="%"
                    name="soil_moisture_pct"
                    value={irrigation.soil_moisture_pct}
                    max={100}
                    onChange={update(setIrrigation)}
                  />

                  <NumberField
                    label="System efficiency"
                    suffix="%"
                    name="efficiency_pct"
                    value={irrigation.efficiency_pct}
                    min={11}
                    max={100}
                    onChange={update(setIrrigation)}
                  />

                  <label className="block space-y-1.5 sm:col-span-2">
                    <span className="text-sm font-medium text-(--color-ink)">
                      Crop growth stage
                    </span>

                    <select
                      className={inputClass}
                      name="growth_stage"
                      value={irrigation.growth_stage}
                      onChange={update(setIrrigation)}
                    >
                      <option value="initial">Initial</option>
                      <option value="development">Development</option>
                      <option value="mid">Mid-season</option>
                      <option value="late">Late-season</option>
                    </select>
                  </label>
                </div>
              </>
            )}

            <Button type="submit" disabled={busy}>
              {busy ? "Calculating..." : "Run analysis"}
            </Button>
          </form>

          {busy && (
            <div className="mt-4">
              <Loader variant="spinner" size="sm" />
            </div>
          )}

          <ResultPanel
            result={result}
            type={tab}
            expectedCrop={expectedCrop}
          />
        </div>

        <aside className="space-y-5">
          <div className="rounded-xl border border-(--color-line) bg-(--color-surface) p-5">
            <h3 className="font-display text-lg text-(--color-ink)">
              Model status
            </h3>

            {loading ? (
              <p className="text-sm text-(--color-muted) mt-3">
                Checking services...
              </p>
            ) : (
              <>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status?.crop_model?.ready
                        ? "bg-green-500"
                        : "bg-amber-500"
                    }`}
                  />

                  <span className="text-sm text-(--color-ink)">
                    {status?.crop_model?.ready
                      ? "Crop ML model ready"
                      : "Crop ML model not trained"}
                  </span>
                </div>

                <p className="text-xs leading-5 text-(--color-muted) mt-2">
                  {status?.crop_model?.message}
                </p>

                {status?.crop_model?.metrics?.accuracy != null && (
                  <p className="text-xs text-(--color-muted) mt-2">
                    Holdout accuracy:{" "}
                    {(status.crop_model.metrics.accuracy * 100).toFixed(1)}%
                  </p>
                )}
              </>
            )}
          </div>

          <div className="rounded-xl border border-(--color-line) bg-(--color-surface) p-5">
            <h3 className="font-display text-lg text-(--color-ink)">
              Recent analyses
            </h3>

            {history.length === 0 ? (
              <p className="text-sm text-(--color-muted) mt-3">
                Your completed analyses will appear here.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {history.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="border-b border-(--color-line) pb-3 last:border-0"
                  >
                    <p className="text-sm font-medium text-(--color-ink)">
                      {item.module
                        .replaceAll("-", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>

                    <p className="text-xs text-(--color-muted) mt-1">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-(--color-canvas) p-5">
            <p className="text-xs font-semibold text-(--color-ink)">
              Important
            </p>

            <p className="text-xs leading-5 text-(--color-muted) mt-2">
              These tools provide educational decision-support estimates,
              not guaranteed outcomes or official agronomic prescriptions.
              Confirm recommendations with a soil test and local
              agricultural experts.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
