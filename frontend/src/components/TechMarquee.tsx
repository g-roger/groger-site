import { motion } from 'framer-motion'

const words = [
  'Python', 'PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'Kafka',
  'FastAPI', 'scikit-learn', 'TensorFlow', 'Keras', 'SHAP', 'AWS SageMaker',
  'Redshift', 'MongoDB', 'Vertex AI', 'LLM Agents', 'Docker', 'Fly.dev',
  'Power BI', 'React', 'TypeScript',
]

export default function TechMarquee() {
  const items = [...words, ...words]
  return (
    <div className="relative py-8 overflow-hidden border-y border-mint/10 bg-forest/40 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-forest to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-forest to-transparent z-10" />
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="text-cream/60 font-display italic text-2xl sm:text-3xl tracking-tight"
          >
            {w}
            <span className="text-mint/50 ml-8">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
