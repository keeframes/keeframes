import styles from "./VideoPlayer.module.css"

function VideoPlayer({ url }) {
  return <div className={styles.container}>
    <video
      src={url}
      loop={true}
    />
  </div>
}

export default VideoPlayer;
